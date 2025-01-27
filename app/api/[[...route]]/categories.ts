import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { categories, insertCategorySchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

/**
 * Hono app instance for handling category-related API routes.
 */
const app = new Hono()

/**
 * GET / - Fetches all categories for the authenticated user.
 * Requires user to be authenticated.
 */
.get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    const data = await db.select({ id: categories.id, name: categories.name }).from(categories).where(eq(categories.userId, auth.userId));
    return c.json({
        data
    });
})

    /**
     * GET /:id - Fetches a specific category by ID for the authenticated user.
     * Requires user to be authenticated.
     * @param {string} id - The ID of the category to fetch.
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
                    id: categories.id, name: categories.name,
                })
                .from(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id),
                    ),
                );

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }
            return c.json({ data });
        }
    )

    /**
     * POST / - Creates a new category for the authenticated user.
     * Requires user to be authenticated.
     * @param {object} body - The request body containing category details.
     * @param {string} body.name - The name of the category.
     */
    .post("/", clerkMiddleware(), zValidator("json", insertCategorySchema.pick({
        name: true,
    })), async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const [data] = await db.insert(categories).values({
            id: createId(),
            userId: auth.userId,
            ...values
        }).returning();
        return c.json({ data });
    })

    /**
     * POST /bulk-delete - Deletes multiple categories for the authenticated user.
     * Requires user to be authenticated.
     * @param {object} body - The request body containing category IDs to delete.
     * @param {string[]} body.ids - The array of category IDs to delete.
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
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        inArray(categories.id, values.ids)
                    )
                )
                .returning(
                    { id: categories.id, }
                );
            return c.json({ data });
        },
    )

    /**
     * PATCH /:id - Updates a category by ID for the authenticated user.
     * Requires user to be authenticated.
     * @param {string} id - The ID of the category to update.
     * @param {object} body - The request body containing category details.
     * @param {string} body.name - The new name of the category.
     */
    .patch("/:id",
        clerkMiddleware(),
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        zValidator(
            "json",
            insertCategorySchema.pick({
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
                .update(categories)
                .set(values)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id),
                    ),
                ).returning();

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }
            return c.json({ data });
        }
    )

    /**
     * DELETE /:id - Deletes a category by ID for the authenticated user.
     * Requires user to be authenticated.
     * @param {string} id - The ID of the category to delete.
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
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id),
                    ),
                ).returning({
                    id: categories.id
                });

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }
            return c.json({ data });
        }
    )

export default app;