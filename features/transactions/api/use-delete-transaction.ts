import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

/**
 * Type alias for the response type of the delete transaction API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

/**
 * Custom hook to handle the deletion of a transaction.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the delete transaction operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @param {string} [id] - The ID of the transaction to be deleted.
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useDeleteTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        /**
         * Function to perform the delete transaction operation.
         *
         * @returns {Promise<ResponseType>} The response from the delete transaction operation.
         * @throws {Error} If the API call fails.
         */
        mutationFn: async () => {
            const response = await client.api.transactions[":id"]["$delete"]({ param: { id } });
            return await response.json();
        },
        /**
         * Callback function to handle successful deletion of the transaction.
         * Displays a success toast notification and invalidates related queries.
         */
        onSuccess: () => {
            toast.success("Transaction deleted");
            queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        /**
         * Callback function to handle errors during the delete transaction operation.
         * Displays an error toast notification.
         */
        onError: () => {
            toast.error("Failed to delete transaction");
        },
    });

    return mutation;
};