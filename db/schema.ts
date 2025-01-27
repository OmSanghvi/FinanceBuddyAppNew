import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

/**
 * Defines the accounts table schema.
 */
export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

/**
 * Defines the relations for the accounts table.
 */
export const accountsRelations = relations(accounts, ({ many }) => ({
    transactions: many(transactions),
}));

/**
 * Schema for inserting a new account.
 */
export const insertAccountSchema = createInsertSchema(accounts);

/**
 * Defines the categories table schema.
 */
export const categories = pgTable("categories", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

/**
 * Defines the relations for the categories table.
 */
export const categoriesRelations = relations(categories, ({ many }) => ({
    transactions: many(transactions),
}));

/**
 * Schema for inserting a new category.
 */
export const insertCategorySchema = createInsertSchema(categories);

/**
 * Defines the transactions table schema.
 */
export const transactions = pgTable("transactions", {
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    payee: text("payee").notNull(),
    notes: text("notes"),
    date: timestamp("date", { mode: "date" }).notNull(),
    accountId: text("account_id").references(() => accounts.id, {
        onDelete: "cascade",
    }).notNull(),
    categoryId: text("category_id").references(() => categories.id, {
        onDelete: "set null",
    }),
});

/**
 * Defines the relations for the transactions table.
 */
export const transactionsRelations = relations(transactions, ({ one }) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id],
    }),
    categories: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
}));

/**
 * Schema for inserting a new transaction.
 */
export const insertTransactionSchema = createInsertSchema(transactions, {
    date: z.coerce.date(),
});

/**
 * Defines the connectedBanks table schema.
 */
export const connectedBanks = pgTable("connected_banks", {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    accessToken: text("access_token").notNull(),
});

/**
 * Defines the aiResponses table schema.
 */
export const aiResponses = pgTable("ai_responses", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull(),
    responseText: varchar("response_text").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Defines the relations for the aiResponses table.
 */
export const aiResponsesRelations = relations(aiResponses, ({ one }) => ({
    user: one(accounts, {
        fields: [aiResponses.userId],
        references: [accounts.id],
    }),
}));

/**
 * Schema for inserting a new AI response.
 */
export const insertAIResponseSchema = createInsertSchema(aiResponses);