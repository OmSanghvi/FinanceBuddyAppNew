import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";

/**
 * Custom hook to fetch categories.
 *
 * This hook uses the `useQuery` hook from `@tanstack/react-query` to fetch the list of categories.
 * It handles the API call to fetch categories and provides error handling.
 *
 * @returns {object} The query object returned by `useQuery`.
 */
export const useGetCategories = () => {
    const query = useQuery({
        /**
         * The key for the query, used for caching and invalidation.
         */
        queryKey: ["categories"],
        /**
         * Function to fetch the categories from the API.
         *
         * @returns {Promise<object>} The data fetched from the API.
         * @throws {Error} If the API call fails.
         */
        queryFn: async () => {
            const response = await client.api.categories.$get();

            if(!response.ok){
                throw new Error("Failed to fetch categories")
            }

            const { data } = await response.json();
            return data;
        },
    })

    return query;
};