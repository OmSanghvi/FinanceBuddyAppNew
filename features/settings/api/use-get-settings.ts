import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetSettings = () => {
    const query = useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const response = await client.api.settings.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch settings");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};