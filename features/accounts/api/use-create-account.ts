import {toast} from "sonner";
import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "@/lib/hono";

/**
 * Type alias for the response type of the create account API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.accounts.$post>;

/**
 * Type alias for the request type of the create account API endpoint.
 */
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

/**
 * Custom hook to handle account creation.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the account creation operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useCreateAccount = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        /**
         * Function to perform the account creation operation.
         *
         * @param {RequestType} json - The request payload for the account creation operation.
         * @returns {Promise<ResponseType>} The response from the account creation operation.
         */
        mutationFn: async (json) => {
            const response = await client.api.accounts.$post({json});
            return await response.json();
        },
        /**
         * Callback function to handle successful account creation.
         */
        onSuccess: () => {
            toast.success("Account created");
            queryClient.invalidateQueries({queryKey: ["accounts"]});
        },
        /**
         * Callback function to handle errors during the account creation operation.
         */
        onError: () => {
            toast.error("Failed to create account");
        },
    });
    return mutation;
}