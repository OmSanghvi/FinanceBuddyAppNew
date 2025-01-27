import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

/**
 * Type alias for the response type of the exchange public token API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.plaid["exchange-public-token"]["$post"], 200>;

/**
 * Type alias for the request type of the exchange public token API endpoint.
 */
type RequestType = InferRequestType<typeof client.api.plaid["exchange-public-token"]["$post"]>["json"];

/**
 * Custom hook to handle the exchange of a public token.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the exchange public token operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useExchangePublicToken = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        /**
         * Function to perform the exchange public token operation.
         *
         * @param {RequestType} json - The request payload for the exchange public token operation.
         * @returns {Promise<ResponseType>} The response from the exchange public token operation.
         * @throws {Error} If the API call fails.
         */
        mutationFn: async (json) => {
            const response = await client.api.plaid["exchange-public-token"].$post({ json });

            if (!response.ok) {
                throw Error("Failed to exchange public token");
            }

            return await response.json();
        },
        /**
         * Callback function to handle successful exchange of the public token.
         * Displays a success toast notification and invalidates related queries.
         */
        onSuccess: () => {
            toast.success("Public token exchanged");
            queryClient.invalidateQueries({ queryKey: ["connected-bank"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        /**
         * Callback function to handle errors during the exchange public token operation.
         * Displays an error toast notification.
         */
        onError: () => {
            toast.error("Failed to exchange public token");
        },
    });

    return mutation;
};