import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";

/**
 * Custom hook to fetch a specific category by ID.
 *
 * This hook uses the `useQuery` hook from `@tanstack/react-query` to fetch the details of a category.
 * It handles the API call to fetch the category and provides error handling.
 *
 * @param {string} [id] - The ID of the category to be fetched.
 * @returns {object} The query object returned by `useQuery`.
 */
export const useGetCategory = (id?:string) => {
    const query = useQuery({
        /**
         * Enables the query only if the ID is provided.
         */
        enabled: !!id,
        /**
         * The key for the query, used for caching and invalidation.
         */
        queryKey: ["category", {id}],
        /**
         * Function to fetch the category from the API.
         *
         * @returns {Promise<object>} The data fetched from the API.
         * @throws {Error} If the API call fails.
         */
        queryFn: async () => {
            const response = await client.api.categories[":id"].$get({param: {id},});

            if(!response.ok){
                throw new Error("Failed to fetch category")
            }

            const { data } = await response.json();
            return data;
        },
    })

    return query;
};