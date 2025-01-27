import {toast} from "sonner";
import { InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "@/lib/hono";

/**
 * Type alias for the response type of the delete account API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

/**
 * Custom hook to handle account deletion.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the account deletion operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @param {string} [id] - The ID of the account to be deleted.
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useDeleteAccount = (id? :string) =>{
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error>({
        /**
         * Function to perform the account deletion operation.
         *
         * @returns {Promise<ResponseType>} The response from the account deletion operation.
         */
        mutationFn: async () => {
            const response = await client.api.accounts[":id"]["$delete"]({ param: {id}});
            return await response.json();
        },
        /**
         * Callback function to handle successful account deletion.
         */
        onSuccess: () => {
            toast.success("Account deleted");
            queryClient.invalidateQueries({queryKey: ["account", {id}]});
            queryClient.invalidateQueries({queryKey: ["accounts"]});
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            queryClient.invalidateQueries({queryKey: ["summary"]});
        },
        /**
         * Callback function to handle errors during the account deletion operation.
         */
        onError: ()=>{
            toast.error("Failed to delete account")
        },
    })
    return mutation;
}