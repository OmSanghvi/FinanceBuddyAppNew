import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";

/**
 * Custom hook to fetch account details.
 *
 * This hook uses the `useQuery` hook from `@tanstack/react-query` to fetch account details.
 * It also provides error handling for failed fetch operations.
 *
 * @param {string} [id] - The ID of the account to be fetched.
 * @returns {object} The query object returned by `useQuery`.
 */
export const useGetAccount = (id?: string) => {
    const query = useQuery({
        /**
         * Determines whether the query should be enabled.
         * The query is enabled only if the `id` is provided.
         */
        enabled: !!id,
        /**
         * The unique key for the query.
         */
        queryKey: ["account", {id}],
        /**
         * Function to fetch the account details.
         *
         * @returns {Promise<object>} The account data.
         * @throws {Error} If the fetch operation fails.
         */
        queryFn: async () => {
            const response = await client.api.accounts[":id"].$get({param: {id}});

            if (!response.ok) {
                throw new Error("Failed to fetch account");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};