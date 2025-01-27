import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

/**
 * Type alias for the response type of the bulk delete transactions API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;

/**
 * Type alias for the request type of the bulk delete transactions API endpoint.
 */
type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"];

/**
 * Custom hook to handle the bulk deletion of transactions.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the bulk delete transactions operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useBulkDeleteTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        /**
         * Function to perform the bulk delete transactions operation.
         *
         * @param {RequestType} json - The request payload for the bulk delete transactions operation.
         * @returns {Promise<ResponseType>} The response from the bulk delete transactions operation.
         * @throws {Error} If the API call fails.
         */
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-delete"].$post({ json });
            return await response.json();
        },
        /**
         * Callback function to handle successful deletion of transactions.
         * Displays a success toast notification and invalidates related queries.
         */
        onSuccess: () => {
            toast.success("Transactions deleted");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        /**
         * Callback function to handle errors during the bulk delete transactions operation.
         * Displays an error toast notification.
         */
        onError: () => {
            toast.error("Failed to delete transactions");
        },
    });

    return mutation;
};