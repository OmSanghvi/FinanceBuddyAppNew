import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

/**
 * Main function to run the database migrations.
 *
 * This function initializes the database connection and runs the migrations
 * located in the "drizzle" folder. If an error occurs during the migration,
 * it logs the error and exits the process with a status code of 1.
 */
const main = async () => {
    try {
        await migrate(db, { migrationsFolder: "drizzle" });
    } catch (error) {
        console.error("Error during migration: ", error);
        process.exit(1);
    }
};

main();