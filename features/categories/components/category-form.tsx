import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCategorySchema } from "@/db/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = insertCategorySchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

/**
 * Props for the CategoryForm component.
 *
 * @typedef {Object} Props
 * @property {string} [id] - The ID of the category.
 * @property {FormValues} [defaultValues] - The default values for the form.
 * @property {function} onSubmit - Function to handle form submission.
 * @property {function} [onDelete] - Function to handle category deletion.
 * @property {boolean} [disabled] - Indicates if the form is disabled.
 */
type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
};

/**
 * CategoryForm component for creating or editing a category.
 *
 * This component renders a form for creating or editing a category with fields for the category name.
 * It uses react-hook-form for form handling and validation with zod.
 *
 * @param {Props} props - The properties for the CategoryForm component.
 * @returns {JSX.Element} The rendered CategoryForm component.
 */
export const CategoryForm = ({
                                 id,
                                 defaultValues,
                                 onSubmit,
                                 onDelete,
                                 disabled
                             }: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
    };

    const handleDelete = () => {
        onDelete?.();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Name
                        </FormLabel>
                        <FormControl>
                            <Input disabled={disabled} placeholder="e.g. Food, Travel, etc." {...field} />
                        </FormControl>
                    </FormItem>
                )}
                />
                <Button className="w-full" disabled={disabled}>
                    {id ? "Save Changes" : "Create category"}
                </Button>
                {!!id && (
                    <Button type="button" disabled={disabled} onClick={handleDelete} className="w-full" variant="outline">
                        <Trash className="size-4 mr-2" />
                        Delete category
                    </Button>
                )}
            </form>
        </Form>
    );
};