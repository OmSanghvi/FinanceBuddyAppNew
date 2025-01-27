import {toast} from "sonner";
import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "@/lib/hono";

/**
 * Type alias for the response type of the edit category API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;

/**
 * Type alias for the request type of the edit category API endpoint.
 */
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"];

/**
 * Custom hook to handle the editing of a category.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the edit category operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @param {string} [id] - The ID of the category to be edited.
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useEditCategory = (id? :string) =>{
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        /**
         * Function to perform the edit category operation.
         *
         * @param {RequestType} json - The request payload for the edit category operation.
         * @returns {Promise<ResponseType>} The response from the edit category operation.
         */
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"]["$patch"]({ param: {id}, json});
            return await response.json();
        },
        /**
         * Callback function to handle successful category editing.
         */
        onSuccess: () => {
            toast.success("Category updated");
            queryClient.invalidateQueries({queryKey: ["category", {id}]});
            queryClient.invalidateQueries({queryKey: ["categories"]});
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            queryClient.invalidateQueries({queryKey: ["summary"]});
        },
        /**
         * Callback function to handle errors during the edit category operation.
         */
        onError: ()=>{
            toast.error("Failed to edit category")
        },
    })
    return mutation;
}