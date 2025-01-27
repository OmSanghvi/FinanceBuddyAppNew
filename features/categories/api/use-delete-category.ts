import {toast} from "sonner";
import { InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "@/lib/hono";

/**
 * Type alias for the response type of the delete category API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>;

/**
 * Custom hook to handle the deletion of a category.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the delete category operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @param {string} [id] - The ID of the category to be deleted.
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useDeleteCategory = (id? :string) =>{
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error>({
        /**
         * Function to perform the delete category operation.
         *
         * @returns {Promise<ResponseType>} The response from the delete category operation.
         */
        mutationFn: async () => {
            const response = await client.api.categories[":id"]["$delete"]({ param: {id}});
            return await response.json();
        },
        /**
         * Callback function to handle successful category deletion.
         */
        onSuccess: () => {
            toast.success("Category deleted");
            queryClient.invalidateQueries({queryKey: ["category", {id}]});
            queryClient.invalidateQueries({queryKey: ["categories"]});
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            queryClient.invalidateQueries({queryKey: ["summary"]});
        },
        /**
         * Callback function to handle errors during the delete category operation.
         */
        onError: ()=>{
            toast.error("Failed to delete category")
        },
    })
    return mutation;
}