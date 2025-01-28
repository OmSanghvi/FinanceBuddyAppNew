import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { CategoryForm } from "./category-form";
import { insertCategorySchema } from "@/db/schema";
import { z } from "zod";
import { useGetCategory } from "../api/use-get-category";
import { Loader2 } from "lucide-react";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";
import { useConfirm } from "@/hooks/use-confirm";

const formSchema = insertCategorySchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

/**
 * EditCategorySheet component for editing an existing category.
 *
 * This component renders a sheet that allows users to edit an existing category.
 * It fetches the category details, displays a form for editing, and handles form submission and category deletion.
 *
 * @returns {JSX.Element} The rendered EditCategorySheet component.
 */
export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory();
    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "You are about to delete this category.");
    const editMutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);
    const isPending = editMutation.isPending || deleteMutation.isPending;
    const categoryQuery = useGetCategory(id);
    const isLoading = categoryQuery.isLoading;

    /**
     * Handles form submission for editing the category.
     *
     * @param {FormValues} values - The form values.
     */
    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, { onSuccess: () => { onClose(); } });
    };

    /**
     * Handles category deletion.
     */
    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    const defaultValues = categoryQuery.data ? { name: categoryQuery.data.name } : { name: "" };

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Category
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing category
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute-inset-0 inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                        <CategoryForm id={id} onSubmit={onSubmit} disabled={isPending} defaultValues={defaultValues} onDelete={onDelete} />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};