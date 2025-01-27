import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

/**
 * Type alias for the response type of the create transaction API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.transactions.$post>;

/**
 * Type alias for the request type of the create transaction API endpoint.
 */
type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"];

/**
 * Custom hook to handle the creation of a transaction.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the create transaction operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        /**
         * Function to perform the create transaction operation.
         *
         * @param {RequestType} json - The request payload for the create transaction operation.
         * @returns {Promise<ResponseType>} The response from the create transaction operation.
         * @throws {Error} If the API call fails.
         */
        mutationFn: async (json) => {
            const response = await client.api.transactions.$post({ json });
            return await response.json();
        },
        /**
         * Callback function to handle successful creation of the transaction.
         * Displays a success toast notification and invalidates related queries.
         */
        onSuccess: () => {
            toast.success("Transaction created");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        /**
         * Callback function to handle errors during the create transaction operation.
         * Displays an error toast notification.
         */
        onError: () => {
            toast.error("Failed to create transaction");
        },
    });

    return mutation;
};