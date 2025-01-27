import { InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

/**
 * Type alias for the response type of the create link token API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.plaid["create-link-token"]["$post"], 200>;

/**
 * Custom hook to handle the creation of a link token.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the create link token operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useCreateLinkToken = () => {

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        /**
         * Function to perform the create link token operation.
         *
         * @returns {Promise<ResponseType>} The response from the create link token operation.
         * @throws {Error} If the API call fails.
         */
        mutationFn: async () => {
            const response = await client.api.plaid["create-link-token"].$post();

            if (!response.ok) {
                throw Error("Failed to create link token");
            }

            return await response.json();
        },
        /**
         * Callback function to handle successful link token creation.
         */
        onSuccess: () => {
            toast.success("Link token created");
        },
        /**
         * Callback function to handle errors during the create link token operation.
         */
        onError: () => {
            toast.error("Failed to create link token");
        },
    });

    return mutation;
};