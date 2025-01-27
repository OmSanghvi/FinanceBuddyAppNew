import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

/**
 * Type alias for the response type of the edit transaction API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;

/**
 * Type alias for the request type of the edit transaction API endpoint.
 */
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];

/**
 * Custom hook to handle the editing of a transaction.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the edit transaction operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @param {string} [id] - The ID of the transaction to be edited.
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        /**
         * Function to perform the edit transaction operation.
         *
         * @param {RequestType} json - The request payload for the edit transaction operation.
         * @returns {Promise<ResponseType>} The response from the edit transaction operation.
         * @throws {Error} If the API call fails.
         */
        mutationFn: async (json) => {
            const response = await client.api.transactions[":id"]["$patch"]({ param: { id }, json });
            return await response.json();
        },
        /**
         * Callback function to handle successful editing of the transaction.
         * Displays a success toast notification and invalidates related queries.
         */
        onSuccess: () => {
            toast.success("Transaction updated");
            queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        /**
         * Callback function to handle errors during the edit transaction operation.
         * Displays an error toast notification.
         */
        onError: () => {
            toast.error("Failed to edit transaction");
        },
    });

    return mutation;
};