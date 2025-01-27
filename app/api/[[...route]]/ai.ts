import { Message } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { accounts, categories, transactions } from "@/db/schema";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { calculatePercentChange, convertAmountFromMiliunits, fillMissingDays } from "@/lib/utils";
import { Hono } from "hono";
import { differenceInDays, parse, subDays } from "date-fns";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

export const runtime = "edge";

/**
 * Hono app instance for handling AI-related API routes.
 */
const app = new Hono();

app.use(clerkMiddleware());

/**
 * GET / - Fetches financial data for the authenticated user within a specified date range.
 * Requires user to be authenticated.
 * @param {string} [from] - The start date of the range (optional).
 * @param {string} [to] - The end date of the range (optional).
 * @param {string} [accountId] - The ID of the account to filter by (optional).
 */
export const GET = app.get(
    "/",
    clerkMiddleware(),
    zValidator("query", z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional()
    })),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);
      const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      const periodLength = differenceInDays(endDate, startDate) + 1;
      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      const [currentPeriod] = await fetchFinancialData(auth.userId, startDate, endDate);
      const [lastPeriod] = await fetchFinancialData(auth.userId, lastPeriodStart, lastPeriodEnd);

      const incomeChange = calculatePercentChange(currentPeriod.income, lastPeriod.income);
      const expensesChange = calculatePercentChange(currentPeriod.expenses, lastPeriod.expenses);
      const remainingChange = calculatePercentChange(currentPeriod.remaining, lastPeriod.remaining);

      const category = await db
          .select({
            name: categories.name,
            value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
          }).from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .innerJoin(categories, eq(transactions.categoryId, categories.id))
          .where(
              and(
                  accountId ? eq(transactions.accountId, accountId) : undefined,
                  eq(accounts.userId, auth.userId),
                  lt(transactions.amount, 0),
                  gte(transactions.date, startDate),
                  lte(transactions.date, endDate)
              )
          ).groupBy(categories.name)
          .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`));

      const topCategories = category.slice(0, 3);
      const otherCategories = category.slice(3);
      const otherSum = otherCategories.reduce((sum, current) => sum + current.value, 0);
      const finalCategories = [...topCategories];

      if (otherCategories.length > 0) {
        finalCategories.push({
          name: "Other",
          value: otherSum,
        });
      }

      const activeDays = await db.select({
        date: transactions.date,
        income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
        expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(Number),
      }).from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
              and(
                  accountId ? eq(transactions.accountId, accountId) : undefined,
                  eq(accounts.userId, auth.userId),
                  gte(transactions.date, startDate),
                  lte(transactions.date, endDate)
              )
          ).groupBy(transactions.date).orderBy(transactions.date);

      const days = fillMissingDays(activeDays, startDate, endDate);

      return c.json({
        data: {
          remainingAmount: currentPeriod.remaining,
          remainingChange,
          incomeAmount: currentPeriod.income,
          incomeChange,
          expensesAmount: currentPeriod.expenses,
          expensesChange,
          categories: finalCategories,
          days,
        }
      });
    }
);

/**
 * POST / - Processes a chat message and generates a response using Google Generative AI.
 * Requires user to be authenticated.
 * @param {object} body - The request body containing chat messages and images.
 * @param {Message[]} body.messages - The array of chat messages.
 * @param {string[]} [body.images] - The array of image data (optional).
 */
export const POST = app.post(async (c) => {
  try {
    const reqBody = await c.req.json();
    const images: string[] = reqBody.data?.images ? JSON.parse(reqBody.data.images) : [];
    const imageParts = filesArrayToGenerativeParts(images);
    const messages: Message[] = reqBody.messages;

    if (!messages || messages.length === 0) {
      throw new Error("No content is provided for sending chat message.");
    }

    const auth = getAuth(c);
    if (!auth?.userId) {
      throw new Error("Unauthorized");
    }

    const defaultTo = new Date();
    const startDate = subDays(defaultTo, 30);
    const [financialData] = await fetchFinancialData(auth.userId, startDate, defaultTo);

    const income = convertAmountFromMiliunits(financialData.income || 0);
    const expenses = Math.abs(convertAmountFromMiliunits(financialData.expenses || 0));

    const userContext = `You are a financial advisor assisting a user with their finances. They have an income of ${income} and expenses of ${expenses} per month.`;

    let promptWithParts: (string | { inlineData: { data: string; mimeType: string } })[] = [userContext, ...messages.map(message => message.content)];
    if (imageParts.length > 0) {
      promptWithParts = promptWithParts.concat(imageParts);
    }

    if (promptWithParts.length === 0) {
      throw new Error("No valid content to send to the AI.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "tunedModels/financialadvicedataset-ljf12fi60qq1",
    });

    const streamingResponse = await model.generateContent(promptWithParts);
    const responseText = streamingResponse.response.text();

    return new Response(JSON.stringify({ text: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

/**
 * Converts an array of image data strings to generative parts for AI processing.
 * @param {string[]} images - The array of image data strings.
 * @returns {Array<{ inlineData: { data: string; mimeType: string } }>} The array of generative parts.
 */
function filesArrayToGenerativeParts(images: string[]) {
  return images.map((imageData) => ({
    inlineData: {
      data: imageData.split(",")[1],
      mimeType: imageData.substring(
          imageData.indexOf(":") + 1,
          imageData.lastIndexOf(";")
      ),
    },
  }));
}

/**
 * Fetches financial data for a user within a specified date range.
 * @param {string} userId - The ID of the user.
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Promise<Array<{ income: number, expenses: number, remaining: number }>>} The financial data.
 */
async function fetchFinancialData(userId: string, startDate: Date, endDate: Date) {
  return db.select({
    income: sql`SUM(CASE WHEN
    ${transactions.amount}
    >=
    0
    THEN
    ${transactions.amount}
    ELSE
    0
    END
    )`.mapWith(Number),
    expenses: sql`SUM(CASE WHEN
    ${transactions.amount}
    <
    0
    THEN
    ${transactions.amount}
    ELSE
    0
    END
    )`.mapWith(Number),
    remaining: sum(transactions.amount).mapWith(Number),
  })
      .from(transactions)
      .innerJoin(accounts,
          eq(transactions.accountId, accounts.id)
      ).where(
          and(
              eq(accounts.userId, userId),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate)
          )
      );
}

/**
 * POST /parse - Parses a text input to extract and process financial data.
 * Requires user to be authenticated.
 * @param {object} body - The request body containing the text to parse.
 * @param {string} body.text - The text to parse.
 */
app.post('/parse', async (c) => {
  try {
    const { text } = await c.req.json();

    if (!text) {
      return c.json({ error: 'No text provided' }, 400);
    }

    const tokens = text.trim().split(/\s+/).map((token: string) => token.toLowerCase());
    const counts = new Map<string, number>();

    let accountName = "";
    let categoryName = "";
    let transactionData: {
      date?: string;
      account?: string;
      category?: string;
      amount?: number;
      payee?: string;
      notes?: string;
    } = {};

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      counts.set(token, (counts.get(token) || 0) + 1);

      if ((token === 'add' && tokens[i + 1] === 'account:')||(token === 'create' && tokens[i + 1] === 'account:')) {
        accountName = tokens[i + 2] || '';
      }
      else if((token === 'add' && tokens[i + 1] === 'new' && tokens[i+2] === "account:")||(token === 'create' && tokens[i + 1] === 'new' && tokens[i+2] === "account:")){
        accountName = tokens[i + 3] || '';
      }
      else if ((token === 'add' && tokens[i + 1] === 'category:')||(token === 'create' && tokens[i + 1] === 'category:')) {
        categoryName = tokens[i + 2] || '';
      }
      else if((token === 'add' && tokens[i + 1] === 'new' && tokens[i+2] === "category:")||(token === 'create' && tokens[i + 1] === 'new' && tokens[i+2] === "category:")){
        categoryName = tokens[i + 3] || '';
      }
      else if (token === 'add' && tokens[i + 1]==='transaction:') {
        transactionData = {
          date: tokens[i + 2] || '',
          account: tokens[i + 3] || '',
          category: tokens[i + 4] || '',
          amount: parseFloat(tokens[i + 5]) || 0,
          payee: tokens[i + 6] || '',
          notes: tokens.slice(i + 7).join(' ')
        };
      } else if (token === 'date') {
        transactionData.date = tokens[i + 1] || '';
      } else if (token === 'amount') {
        transactionData.amount = parseFloat(tokens[i + 1]) || 0;
      } else if (token === 'payee') {
        transactionData.payee = tokens[i + 1] || '';
      }
    }

    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (accountName) {
      await db.insert(accounts).values({
        id: uuidv4(),
        name: accountName,
        userId: auth.userId
      });
    }
    if (categoryName) {
      await db.insert(categories).values({
        id: uuidv4(),
        name: categoryName,
        userId: auth.userId
      });
    }

    if (transactionData.date && transactionData.account && transactionData.category && transactionData.amount && transactionData.payee) {
      const account = await db.select({ id: accounts.id })
          .from(accounts)
          .where(
              and(
                  eq(accounts.name, transactionData.account),
                  eq(accounts.userId, auth.userId)
              )
          )
          .limit(1);

      const category = await db.select({ id: categories.id })
          .from(categories)
          .where(
              and(
                  eq(categories.name, transactionData.category),
                  eq(categories.userId, auth.userId)
              )
          )
          .limit(1);

      await db.insert(transactions).values({
        id: uuidv4(),
        date: new Date(transactionData.date),
        accountId: account[0]?.id,
        categoryId: category[0]?.id,
        amount: transactionData.amount,
        payee: transactionData.payee,
        notes: transactionData.notes,
      });
    }

    return c.json({ message: 'Data processed successfully', accountName, categoryName, transactionData });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Error processing request' }, 500);
  }
});

export default app;