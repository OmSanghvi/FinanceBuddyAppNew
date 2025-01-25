"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";
import Chat from "@/components/chat";
import LoadingPage from "@/components/LoadingPage";

const CategoriesPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const newCategory = useNewCategory();
    const categoriesQuery = useGetCategories();
    const deleteCategories = useBulkDeleteCategories();
    const categories = categoriesQuery.data || [];

    const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending;

    useEffect(() => {
        if (!categoriesQuery.isLoading) {
            setIsLoading(false);
        }
    }, [categoriesQuery.isLoading]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Categories page
                    </CardTitle>
                    <Button onClick={newCategory.onOpen} size="sm">
                        <Plus className="size-4 mr-2" />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        filterKey="name"
                        columns={columns}
                        data={categories}
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteCategories.mutate({ ids });
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
            <Chat />
        </div>
    );
}

export default CategoriesPage;