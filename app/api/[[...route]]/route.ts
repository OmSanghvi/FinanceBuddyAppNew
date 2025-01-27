import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";
import summary from './summary';
import plaid from './plaid';
import ai from './ai';

export const runtime = 'edge'

/**
 * Hono app instance for handling API routes.
 * Sets the base path for all routes to '/api'.
 */
const app = new Hono().basePath('/api')

/**
 * Defines the routes for the Hono app.
 * - /summary: Routes to the summary module.
 * - /accounts: Routes to the accounts module.
 * - /categories: Routes to the categories module.
 * - /transactions: Routes to the transactions module.
 * - /plaid: Routes to the Plaid module.
 * - /ai: Routes to the AI module.
 */
const routes = app
    .route("/summary", summary)
    .route("/accounts", accounts)
    .route("/categories", categories)
    .route("/transactions", transactions)
    .route("/plaid", plaid)
    .route("/ai", ai)

/**
 * Handles GET requests for the Hono app.
 */
export const GET = handle(app);

/**
 * Handles POST requests for the Hono app.
 */
export const POST = handle(app);

/**
 * Handles PATCH requests for the Hono app.
 */
export const PATCH = handle(app);

/**
 * Handles DELETE requests for the Hono app.
 */
export const DELETE = handle(app);

/**
 * Type definition for the Hono app routes.
 */
export type AppType = typeof routes;