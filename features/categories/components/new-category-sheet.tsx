import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { CategoryForm } from "./category-form";
import { insertCategorySchema } from "@/db/schema";
import { z } from "zod";
import { useCreateCategory } from "../api/use-create-category";

// Define the schema for the form using zod, picking only the 'name' field
const formSchema = insertCategorySchema.pick({
    name: true,
});

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;

/**
 * Component for rendering a sheet to create a new category.
 * It uses a form to input the category name and handles form submission.
 *
 * @returns {JSX.Element} The rendered NewCategorySheet component.
 */
export const NewCategorySheet = () => {
    // Hook to manage the state of the new category sheet (open/close)
    const { isOpen, onClose } = useNewCategory();

    // Hook to handle the creation of a new category
    const mutation = useCreateCategory();

    /**
     * Handles form submission.
     *
     * @param {FormValues} values - The values from the form.
     */
    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, { onSuccess: () => { onClose(); } });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Create a new category to organize your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{ name: "" }} />
            </SheetContent>
        </Sheet>
    );
};