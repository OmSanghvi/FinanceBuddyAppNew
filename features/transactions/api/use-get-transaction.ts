import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

/**
 * Custom hook to fetch a transaction by ID.
 *
 * This hook uses the `useQuery` hook from `@tanstack/react-query` to fetch the transaction data.
 * It also converts the transaction amount from miliunits to a more readable format.
 *
 * @param {string} [id] - The ID of the transaction to be fetched.
 * @returns {object} The query object returned by `useQuery`.
 * @throws {Error} If the API call fails.
 */
export const useGetTransaction = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ["transaction", { id }],
        /**
         * Function to fetch the transaction data.
         *
         * @returns {Promise<object>} The fetched transaction data.
         * @throws {Error} If the API call fails.
         */
        queryFn: async () => {
            const response = await client.api.transactions[":id"].$get({ param: { id } });

            if (!response.ok) {
                throw new Error("Failed to fetch transaction");
            }

            const { data } = await response.json();
            return {
                ...data,
                amount: convertAmountFromMiliunits(data.amount),
            };
        },
    });

    return query;
};