import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

/**
 * Creates a client instance for the Hono API.
 *
 * The client is configured with the application type and the base URL from the environment variable `NEXT_PUBLIC_APP_URL`.
 *
 * @type {AppType} The type of the application.
 * @param {string} process.env.NEXT_PUBLIC_APP_URL - The base URL for the API client.
 * @returns {object} The configured Hono API client instance.
 */
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);