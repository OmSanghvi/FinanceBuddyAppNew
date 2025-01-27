import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from "./schema";

/**
 * Creates a Neon SQL client instance using the provided database URL.
 * @type {import('@neondatabase/serverless').NeonClient}
 */
export const sql = neon(process.env.DATABASE_URL!);

/**
 * Creates a Drizzle ORM instance using the Neon SQL client and the provided schema.
 * @type {import('drizzle-orm').DrizzleInstance}
 */
export const db = drizzle(sql, { schema });