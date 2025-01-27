import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";

/**
 * Custom hook to fetch a list of accounts.
 *
 * This hook uses the `useQuery` hook from `@tanstack/react-query` to fetch the list of accounts.
 * It also provides error handling for failed fetch operations.
 *
 * @returns {object} The query object returned by `useQuery`.
 */
export const useGetAccounts = () => {
    const query = useQuery({
        /**
         * The unique key for the query.
         */
        queryKey: ["accounts"],
        /**
         * Function to fetch the list of accounts.
         *
         * @returns {Promise<object>} The accounts data.
         * @throws {Error} If the fetch operation fails.
         */
        queryFn: async () => {
            const response = await client.api.accounts.$get();

            if(!response.ok){
                throw new Error("Failed to fetch accounts")
            }

            const { data } = await response.json();
            return data;
        },
    })

    return query;
};