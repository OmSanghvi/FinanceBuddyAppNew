import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateAccount } from "../api/use-create-account";

const formSchema = insertAccountSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

/**
 * NewAccountSheet component for creating a new account.
 *
 * This component renders a sheet that allows users to create a new account.
 * It displays a form for entering the account name and handles form submission.
 *
 * @returns {JSX.Element} The rendered NewAccountSheet component.
 */
export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccount();
    const mutation = useCreateAccount();

    /**
     * Handles form submission for creating a new account.
     *
     * @param {FormValues} values - The form values.
     */
    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, { onSuccess: () => { onClose(); } });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your accounts.
                    </SheetDescription>
                </SheetHeader>
                <AccountForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{ name: "" }} />
            </SheetContent>
        </Sheet>
    );
};