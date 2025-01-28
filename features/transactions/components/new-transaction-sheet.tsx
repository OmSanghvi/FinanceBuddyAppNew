import { useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { TransactionForm } from "./transaction-form";
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateTransaction } from "../api/use-create-transaction";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { Loader2 } from "lucide-react";

// Define the schema for the form using zod, omitting the 'id' field
const formSchema = insertTransactionSchema.omit({
    id: true,
});

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;

/**
 * Component for rendering a sheet to create a new transaction.
 * It uses a form to input transaction details and handles form submission.
 *
 * @returns {JSX.Element} The rendered NewTransactionSheet component.
 */
export const NewTransactionSheet = () => {
    // Hook to manage the state of the new transaction sheet (open/close) and transaction data
    const { isOpen, onClose, transactionData, setTransactionData } = useNewTransaction();
    // Hook to handle the creation of a new transaction
    const createMutation = useCreateTransaction();
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
    // Determine if any mutation or query is pending
    const isPending = createMutation.isPending || categoryMutation.isPending || accountMutation.isPending;
    // Determine if any query is loading
    const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

    /**
     * Handles form submission.
     *
     * @param {FormValues} values - The values from the form.
     */
    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, { onSuccess: () => { onClose(); setTransactionData(null); } });
    };

    // Effect to log transaction data when it changes
    useEffect(() => {
        if (transactionData) {
            console.log(transactionData);
        }
    }, [transactionData]);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Add a new transaction
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin" />
                    </div>
                ) : (
                    <TransactionForm
                        defaultValues={transactionData}
                        onSubmit={onSubmit}
                        disabled={isPending}
                        categoryOptions={categoryOptions}
                        onCreateCategory={onCreateCategory}
                        accountOptions={accountOptions}
                        onCreateAccount={onCreateAccount}
                        onImageUpload={() => {}}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
};