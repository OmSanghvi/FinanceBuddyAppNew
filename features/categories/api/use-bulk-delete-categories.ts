import {toast} from "sonner";
import {InferRequestType, InferResponseType} from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "@/lib/hono";

/**
 * Type alias for the response type of the bulk delete categories API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;

/**
 * Type alias for the request type of the bulk delete categories API endpoint.
 */
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];

/**
 * Custom hook to handle bulk deletion of categories.
 *
 * This hook uses the `useMutation` hook from `@tanstack/react-query` to perform the bulk delete operation.
 * It also provides success and error handling using the `sonner` toast notifications.
 *
 * @returns {object} The mutation object returned by `useMutation`.
 */
export const useBulkDeleteCategories = () =>{
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        /**
         * Function to perform the bulk delete operation.
         *
         * @param {RequestType} json - The request payload for the bulk delete operation.
         * @returns {Promise<ResponseType>} The response from the bulk delete operation.
         */
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"]["$post"]({json});
            return await response.json();
        },
        /**
         * Callback function to handle successful bulk deletion.
         */
        onSuccess: () => {
            toast.success("Categories deleted");
            queryClient.invalidateQueries({queryKey: ["categories"]});
            queryClient.invalidateQueries({queryKey: ["summary"]});
        },
        /**
         * Callback function to handle errors during the bulk delete operation.
         */
        onError: ()=>{
            toast.error("Failed to delete categories")
        },
    })
    return mutation;
}