import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

/**
 * Type alias for the response type of the delete connected bank API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.plaid["connected-bank"]["$delete"], 200>;

/**
 * Custom hook to handle the deletion of a connected bank.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the delete connected bank operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useDeleteConnectedBank = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        /**
         * Function to perform the delete connected bank operation.
         *
         * @returns {Promise<ResponseType>} The response from the delete connected bank operation.
         * @throws {Error} If the API call fails.
         */
        mutationFn: async () => {
            const response = await client.api.plaid["connected-bank"].$delete();

            if (!response.ok) {
                throw new Error("Failed to delete connected bank");
            }

            return await response.json();
        },
        /**
         * Callback function to handle the mutation before it is executed.
         * Cancels any ongoing queries and sets the query data to null.
         *
         * @returns {object} The previous bank data.
         */
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["connected-bank"] });
            const previousBankData = queryClient.getQueryData(["connected-bank"]);
            queryClient.setQueryData(["connected-bank"], null);
            return { previousBankData };
        },
        /**
         * Callback function to handle successful deletion of the connected bank.
         * Displays a success toast notification and invalidates related queries.
         */
        onSuccess: () => {
            toast.success("Connected bank deleted");
            queryClient.invalidateQueries({ queryKey: ["connected-bank"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        /**
         * Callback function to handle errors during the delete connected bank operation.
         * Displays an error toast notification and invalidates related queries.
         */
        onError: () => {
            toast.error("Failed to delete connected bank");
            queryClient.invalidateQueries({ queryKey: ["connected-bank"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    return mutation;
};