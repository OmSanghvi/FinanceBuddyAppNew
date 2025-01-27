import {toast} from "sonner";
import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "@/lib/hono";

/**
 * Type alias for the response type of the bulk delete accounts API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;

/**
 * Type alias for the request type of the bulk delete accounts API endpoint.
 */
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

/**
 * Custom hook to handle bulk deletion of accounts.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the bulk delete operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        /**
         * Function to perform the bulk delete operation.
         *
         * @param {RequestType} json - The request payload for the bulk delete operation.
         * @returns {Promise<ResponseType>} The response from the bulk delete operation.
         */
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({json});
            return await response.json();
        },
        /**
         * Callback function to handle successful bulk delete operation.
         */
        onSuccess: () => {
            toast.success("Accounts deleted");
            queryClient.invalidateQueries({queryKey: ["accounts"]});
            // TODO: Also invalidate summary
        },
        /**
         * Callback function to handle errors during the bulk delete operation.
         */
        onError: () => {
            toast.error("Failed to delete accounts");
        },
    });
    return mutation;
}