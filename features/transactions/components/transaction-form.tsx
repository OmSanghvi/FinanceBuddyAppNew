import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker";
import { insertTransactionSchema } from "@/db/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/select";
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/amount-input";
import { convertAmountToMiliunits } from "@/lib/utils";

// Define the schema for the form using zod
const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional(),
});

// Define the schema for the API using zod, omitting the 'id' field
const apiSchema = insertTransactionSchema.omit({ id: true });

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;
// Define the type for API form values based on the schema
type ApiFormValues = z.input<typeof apiSchema>;

// Define the props for the TransactionForm component
type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: { label: string; value: string }[];
    categoryOptions: { label: string; value: string }[];
    onCreateAccount: (name: string) => void;
    onCreateCategory: (name: string) => void;
    onImageUpload: (data: any) => void;
};

/**
 * Component for rendering a form to create or edit a transaction.
 * It handles form submission, deletion, and image upload.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} The rendered TransactionForm component.
 */
export const TransactionForm = ({
                                    id,
                                    defaultValues,
                                    onSubmit,
                                    onDelete,
                                    disabled,
                                    accountOptions,
                                    categoryOptions,
                                    onCreateAccount,
                                    onCreateCategory,
                                    onImageUpload,
                                }: Props) => {
    // Initialize the form with react-hook-form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    /**
     * Handles form submission.
     *
     * @param {FormValues} values - The values from the form.
     */
    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount);
        const amountInMiliunits = convertAmountToMiliunits(amount);
        const apiValues: ApiFormValues = {
            ...values,
            amount: amountInMiliunits,
        };
        onSubmit(apiValues);
    };

    /**
     * Prompts the user to enter the account ID.
     *
     * @returns {Promise<string | null>} The entered account ID or null if cancelled.
     */
    const promptForAccount = async (): Promise<string | null> => {
        return new Promise((resolve) => {
            const accountId = window.prompt("Please enter the account ID:");
            resolve(accountId);
        });
    };

    /**
     * Prompts the user to enter the category ID.
     *
     * @returns {Promise<string | null>} The entered category ID or null if cancelled.
     */
    const promptForCategory = async (): Promise<string | null> => {
        return new Promise((resolve) => {
            const categoryId = window.prompt("Please enter the category ID:");
            resolve(categoryId);
        });
    };

    /**
     * Handles the deletion of the transaction.
     */
    const handleDelete = () => {
        onDelete?.();
    };

    /**
     * Handles image upload and sets form values based on the uploaded data.
     *
     * @param {any} data - The data from the image upload.
     */
    const handleImageUpload = async (data: any) => {
        if (data && data.date && data.payee && data.amount !== undefined) {
            const accountId = await promptForAccount();
            const categoryId = await promptForCategory();
            if (accountId && categoryId) {
                form.setValue("date", data.date, { shouldValidate: true });
                form.setValue("payee", data.payee, { shouldValidate: true });
                form.setValue("amount", data.amount.toString(), { shouldValidate: true });
                form.setValue("accountId", accountId, { shouldValidate: true });
                form.setValue("categoryId", categoryId, { shouldValidate: true });
            } else {
                console.error("Account or category selection was cancelled.");
            }
        } else {
            console.error("Invalid data received for image upload:", data);
        }
    };

    // Set the image upload handler
    onImageUpload(handleImageUpload);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField name="date" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                            <DatePicker {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField name="payee" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Payee</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField name="amount" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                            <AmountInput {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField name="notes" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                            <Textarea {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField name="accountId" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Account</FormLabel>
                        <FormControl>
                            <Select {...field} options={accountOptions} onCreate={onCreateAccount} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField name="categoryId" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                            <Select {...field} options={categoryOptions} onCreate={onCreateCategory} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" disabled={disabled}>Submit</Button>
                {onDelete && (
                    <Button type="button" onClick={handleDelete} disabled={disabled} variant="destructive">
                        <Trash className="mr-2" />
                        Delete
                    </Button>
                )}
            </form>
        </Form>
    );
};