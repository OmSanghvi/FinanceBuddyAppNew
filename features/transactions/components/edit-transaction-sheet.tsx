import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction";
import { Loader2 } from "lucide-react";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { TransactionForm } from "./transaction-form";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";

// Define the schema for the form using zod, omitting the 'id' field
const formSchema = insertTransactionSchema.omit({
    id: true,
});

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;

/**
 * Component for rendering a sheet to edit an existing transaction.
 * It uses a form to input transaction details and handles form submission and deletion.
 *
 * @returns {JSX.Element} The rendered EditTransactionSheet component.
 */
export const EditTransactionSheet = () => {
    // Hook to manage the state of the edit transaction sheet (open/close) and get the transaction ID
    const { isOpen, onClose, id } = useOpenTransaction();
    // Hook to use a confirmation dialog
    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "You are about to delete this transaction.");
    // Hook to handle the editing of a transaction
    const editMutation = useEditTransaction(id);
    // Hook to handle the deletion of a transaction
    const deleteMutation = useDeleteTransaction(id);
    // Hook to handle the creation of a new category
    const categoryMutation = useCreateCategory();
    // Hook to get the list of categories
    const categoryQuery = useGetCategories();
    // Function to create a new category
    const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
    // Map the category data to options for the form
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({ label: category.name, value: category.id }));

    // Hook to handle the creation of a new account
    const accountMutation = useCreateAccount();
    // Hook to get the list of accounts
    const accountQuery = useGetAccounts();
    // Function to create a new account
    const onCreateAccount = (name: string) => accountMutation.mutate({ name });
    // Map the account data to options for the form
    const accountOptions = (accountQuery.data ?? []).map((account) => ({ label: account.name, value: account.id }));
    // Hook to get the transaction details
    const transactionQuery = useGetTransaction(id);
    // Determine if any mutation or query is pending
    const isPending = editMutation.isPending || deleteMutation.isPending || transactionQuery.isLoading || categoryMutation.isPending || accountMutation.isPending;
    // Determine if any query is loading
    const isLoading = transactionQuery.isLoading || accountQuery.isLoading || categoryQuery.isLoading;

    /**
     * Handles form submission.
     *
     * @param {FormValues} values - The values from the form.
     */
    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, { onSuccess: () => { onClose(); } });
    };

    /**
     * Handles the deletion of the transaction.
     * It shows a confirmation dialog and, if confirmed, deletes the transaction.
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

    // Define the default values for the form based on the transaction data
    const defaultValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
    } : { accountId: "", categoryId: "", amount: "", date: new Date(), payee: "", notes: "" };

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Transaction
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing transaction
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute-inset-0 inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                        <TransactionForm
                            id={id}
                            defaultValues={defaultValues}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            disabled={isPending}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateAccount}
                            onImageUpload={() => { }}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};