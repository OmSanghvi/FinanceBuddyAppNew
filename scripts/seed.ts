import { accounts, categories, transactions } from "@/db/schema";
import { convertAmountToMiliunits } from "@/lib/utils";
import { neon } from "@neondatabase/serverless";
import { eachDayOfInterval, format, subDays } from "date-fns";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const SEED_USER_ID = "user_2kzm7dcA1a7ShdEkdlXmU2okmVz";
const SEED_CATEGORIES = [
    { id: "category_1", name: "Food", userId: SEED_USER_ID, plaidID: null },
    { id: "category_2", name: "Rent", userId: SEED_USER_ID, plaidID: null },
    { id: "category_3", name: "Utilities", userId: SEED_USER_ID, plaidID: null },
    { id: "category_7", name: "Clothing", userId: SEED_USER_ID, plaidID: null },
];

const SEED_ACCOUNTS = [
    { id: "account_1", name: "Checking", userId: SEED_USER_ID, plaidID: null },
    { id: "account_2", name: "Savings", userId: SEED_USER_ID, plaidID: null },
];

const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 90);
const SEED_TRANSACTIONS: typeof transactions.$inferSelect[] = [];

/**
 * Generates a random amount based on the category.
 *
 * @param {typeof categories.$inferInsert} category - The category for which to generate the amount.
 * @returns {number} The generated random amount.
 */
const generateRandomAmount = (category: typeof categories.$inferInsert) => {
    switch (category.name) {
        case "Rent":
            return Math.random() * 400 + 90;
        case "Utilities":
            return Math.random() * 200 + 50;
        case "Food":
            return Math.random() * 30 + 10;
        case "Transportation":
        case "Health":
            return Math.random() * 50 + 15;
        case "Clothing":
        case "Miscellaneous":
            return Math.random() * 100 + 20;
        default:
            return Math.random() * 50 + 10;
    }
};

/**
 * Generates transactions for a specific day.
 *
 * @param {Date} day - The day for which to generate transactions.
 */
const generateTransactionsForDay = (day: Date) => {
    const numTransactions = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < numTransactions; i++) {
        const category = SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];
        const isExpense = Math.random() > 0.6;
        const amount = generateRandomAmount(category);
        const formattedAmount = convertAmountToMiliunits(isExpense ? -amount : amount);

        SEED_TRANSACTIONS.push({
            id: `transaction_${format(day, "yyyy-MM-dd")}_${i}`,
            accountId: SEED_ACCOUNTS[0].id,
            categoryId: category.id,
            date: day,
            amount: formattedAmount,
            payee: "Merchant",
            notes: "Random transaction",
        });
    }
};

/**
 * Generates transactions for a range of days.
 */
const generateTransactions = () => {
    const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo });
    days.forEach(day => generateTransactionsForDay(day));
};

generateTransactions();

/**
 * Main function to seed the database with initial data.
 *
 * This function deletes existing data in the transactions, accounts, and categories tables,
 * and inserts the seed data into these tables.
 */
const main = async () => {
    try {
        await db.delete(transactions).execute();
        await db.delete(accounts).execute();
        await db.delete(categories).execute();
        await db.insert(categories).values(SEED_CATEGORIES).execute();
        await db.insert(accounts).values(SEED_ACCOUNTS).execute();
        await db.insert(transactions).values(SEED_TRANSACTIONS).execute();
    } catch (error) {
        console.error("Error during seed: ", error);
        process.exit(1);
    }
};

main();