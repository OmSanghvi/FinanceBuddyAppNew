import {toast} from "sonner";
import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "@/lib/hono";

/**
 * Type alias for the response type of the create category API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.categories.$post>;

/**
 * Type alias for the request type of the create category API endpoint.
 */
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

/**
 * Custom hook to handle the creation of a new category.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the create category operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useCreateCategory = () =>{
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        /**
         * Function to perform the create category operation.
         *
         * @param {RequestType} json - The request payload for the create category operation.
         * @returns {Promise<ResponseType>} The response from the create category operation.
         */
        mutationFn: async (json) => {
            const response = await client.api.categories.$post({json});
            return await response.json();
        },
        /**
         * Callback function to handle successful category creation.
         */
        onSuccess: () => {
            toast.success("Category created");
            queryClient.invalidateQueries({queryKey: ["categories"]});
        },
        /**
         * Callback function to handle errors during the create category operation.
         */
        onError: ()=>{
            toast.error("Failed to create category")
        },
    })
    return mutation;
}