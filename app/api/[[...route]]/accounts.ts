import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

/**
 * Hono app instance for handling account-related API routes.
 */
const app = new Hono()

    /**
     * GET / - Fetches all accounts for the authenticated user.
     * Requires user to be authenticated.
     */
    .get("/", clerkMiddleware(), async (c) => {
        const auth = getAuth(c);

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        const data = await db.select({ id: accounts.id, name: accounts.name }).from(accounts).where(eq(accounts.userId, auth.userId));
        return c.json({ data });
    })

    /**
     * GET /:id - Fetches a specific account by ID for the authenticated user.
     * Requires user to be authenticated.
     * @param {string} id - The ID of the account to fetch.
     */
    .get(
        "/:id",
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            const [data] = await db
                .select({
                    id: accounts.id, name: accounts.name,
                })
                .from(accounts)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(accounts.id, id),
                    ),
                );

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }
            return c.json({ data });
        }
    )

    /**
     * POST / - Creates a new account for the authenticated user.
     * Requires user to be authenticated.
     * @param {object} body - The request body containing account details.
     * @param {string} body.name - The name of the account.
     */
    .post("/", clerkMiddleware(), zValidator("json", insertAccountSchema.pick({
        name: true,
    })), async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const [data] = await db.insert(accounts).values({
            id: createId(),
            userId: auth.userId,
            ...values
        }).returning();
        return c.json({ data });
    })

    /**
     * POST /bulk-delete - Deletes multiple accounts for the authenticated user.
     * Requires user to be authenticated.
     * @param {object} body - The request body containing account IDs to delete.
     * @param {string[]} body.ids - The array of account IDs to delete.
     */
    .post("/bulk-delete", clerkMiddleware(), zValidator("json", z.object(
            { ids: z.array(z.string()) })),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");
            if (!auth?.userId) {
                return (c.json({ error: "Unauthorized" }, 401));
            }
            const data = await db
                .delete(accounts)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        inArray(accounts.id, values.ids)
                    )
                )
                .returning(
                    { id: accounts.id, }
                );
            return c.json({ data });
        },
    )

    /**
     * PATCH /:id - Updates an account by ID for the authenticated user.
     * Requires user to be authenticated.
     * @param {string} id - The ID of the account to update.
     * @param {object} body - The request body containing account details.
     * @param {string} body.name - The new name of the account.
     */
    .patch("/:id",
        clerkMiddleware(),
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        zValidator(
            "json",
            insertAccountSchema.pick({
                name: true,
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");
            const values = c.req.valid("json");
            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            const [data] = await db
                .update(accounts)
                .set(values)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(accounts.id, id),
                    ),
                ).returning();

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }
            return c.json({ data });
        }
    )

    /**
     * DELETE /:id - Deletes an account by ID for the authenticated user.
     * Requires user to be authenticated.
     * @param {string} id - The ID of the account to delete.
     */
    .delete("/:id",
        clerkMiddleware(),
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");
            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            const [data] = await db
                .delete(accounts)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(accounts.id, id),
                    ),
                ).returning({
                    id: accounts.id
                });

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }
            return c.json({ data });
        }
    )

export default app;