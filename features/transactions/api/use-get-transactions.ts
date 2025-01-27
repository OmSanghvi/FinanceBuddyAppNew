import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

/**
 * Custom hook to fetch transactions based on query parameters.
 *
 * This hook uses the `useQuery` hook from `@tanstack/react-query` to fetch the transactions data.
 * It also converts the transaction amounts from miliunits to a more readable format.
 *
 * @returns {object} The query object returned by `useQuery`.
 * @throws {Error} If the API call fails.
 */
export const useGetTransactions = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";
    const query = useQuery({
        queryKey: ["transactions", { from, to, accountId }],
        /**
         * Function to fetch the transactions data.
         *
         * @returns {Promise<object[]>} The fetched transactions data.
         * @throws {Error} If the API call fails.
         */
        queryFn: async () => {
            const response = await client.api.transactions.$get({ query: { from, to, accountId } });

            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }

            const { data } = await response.json();
            return data.map((transaction) => ({
                ...transaction,
                amount: convertAmountFromMiliunits(transaction.amount),
            }));
        },
    });

    return query;
};