import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

/**
 * Custom hook to fetch the connected bank data.
 *
 * This hook uses the `useQuery` hook from `@tanstack/react-query` to perform the fetch operation.
 *
 * @returns {object} The query object returned by `useQuery`.
 */
export const useGetConnectedBank = () => {
    const query = useQuery({
        /**
         * The key for the query, used for caching and invalidation.
         */
        queryKey: ["connected-bank"],
        /**
         * Function to fetch the connected bank data.
         *
         * @returns {Promise<object>} The data from the connected bank API.
         * @throws {Error} If the API call fails.
         */
        queryFn: async () => {
            const response = await client.api.plaid["connected-bank"].$get();

            if (!response.ok) {
                throw new Error("Failed to fetch connected bank");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};