import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertAccountSchema } from "@/db/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = insertAccountSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

/**
 * Props for the AccountForm component.
 *
 * @typedef {Object} Props
 * @property {string} [id] - The ID of the account.
 * @property {FormValues} [defaultValues] - The default values for the form.
 * @property {function} onSubmit - Function to handle form submission.
 * @property {function} [onDelete] - Function to handle account deletion.
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
 * AccountForm component for creating or editing an account.
 *
 * This component renders a form for creating or editing an account with fields for the account name.
 * It uses react-hook-form for form handling and validation with zod.
 *
 * @param {Props} props - The properties for the AccountForm component.
 * @returns {JSX.Element} The rendered AccountForm component.
 */
export const AccountForm = ({
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
                            <Input disabled={disabled} placeholder="e.g. Cash, Bank, Credit Card" {...field} />
                        </FormControl>
                    </FormItem>
                )}
                />
                <Button className="w-full" disabled={disabled}>
                    {id ? "Save Changes" : "Create account"}
                </Button>
                {!!id && (
                    <Button type="button" disabled={disabled} onClick={handleDelete} className="w-full" variant="outline">
                        <Trash className="size-4 mr-2" />
                        Delete account
                    </Button>
                )}
            </form>
        </Form>
    );
};