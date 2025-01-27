import {toast} from "sonner";
import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "@/lib/hono";

/**
 * Type alias for the response type of the edit account API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;

/**
 * Type alias for the request type of the edit account API endpoint.
 */
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

/**
 * Custom hook to handle account editing.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the account editing operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @param {string} [id] - The ID of the account to be edited.
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useEditAccount = (id? :string) =>{
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        /**
         * Function to perform the account editing operation.
         *
         * @param {RequestType} json - The request payload for the account editing operation.
         * @returns {Promise<ResponseType>} The response from the account editing operation.
         */
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"]["$patch"]({ param: {id}, json});
            return await response.json();
        },
        /**
         * Callback function to handle successful account editing.
         */
        onSuccess: () => {
            toast.success("Account updated");
            queryClient.invalidateQueries({queryKey: ["account", {id}]});
            queryClient.invalidateQueries({queryKey: ["accounts"]});
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            queryClient.invalidateQueries({queryKey: ["summary"]});
        },
        /**
         * Callback function to handle errors during the account editing operation.
         */
        onError: ()=>{
            toast.error("Failed to edit account")
        },
    })
    return mutation;
}