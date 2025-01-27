import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import {client} from "@/lib/hono";

import { convertAmountFromMiliunits } from "@/lib/utils";

/**
 * Custom hook to fetch the summary data.
 *
 * This hook uses the `useQuery` hook from `@tanstack/react-query` to perform the fetch operation.
 * It also uses the `useSearchParams` hook from `next/navigation` to get query parameters from the URL.
 *
 * @returns {object} The query object returned by `useQuery`.
 */
export const useGetSummary = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";
    const query = useQuery({
        /**
         * The key for the query, used for caching and invalidation.
         */
        queryKey: ["summary", { from, to, accountId }],
        /**
         * Function to fetch the summary data.
         *
         * @returns {Promise<object>} The data from the summary API.
         * @throws {Error} If the API call fails.
         */
        queryFn: async () => {
            const response = await client.api.summary.$get({ query: { from, to, accountId } });

            if (!response.ok) {
                throw new Error("Failed to fetch summary");
            }

            const { data } = await response.json();
            return {
                ...data,
                incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
                expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
                remainingAmount: convertAmountFromMiliunits(data.remainingAmount),

                categories: data.categories.map((category) => ({
                    ...category,
                    value: convertAmountFromMiliunits(category.value),
                })),
                days: data.days.map((day) => ({
                    ...day,
                    income: convertAmountFromMiliunits(day.income),
                    expenses: convertAmountFromMiliunits(day.expenses),
                }))
            };
        },
    });

    return query;
};