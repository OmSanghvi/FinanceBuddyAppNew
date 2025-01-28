import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";

const formSchema = insertAccountSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

/**
 * EditAccountSheet component for editing an existing account.
 *
 * This component renders a sheet that allows users to edit an existing account.
 * It fetches the account details, displays a form for editing, and handles form submission and account deletion.
 *
 * @returns {JSX.Element} The rendered EditAccountSheet component.
 */
export const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount();
    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "You are about to delete this account.");
    const editMutation = useEditAccount(id);
    const deleteMutation = useDeleteAccount(id);
    const isPending = editMutation.isPending || deleteMutation.isPending;
    const accountQuery = useGetAccount(id);
    const isLoading = accountQuery.isLoading;

    /**
     * Handles form submission for editing the account.
     *
     * @param {FormValues} values - The form values.
     */
    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, { onSuccess: () => { onClose(); } });
    };

    /**
     * Handles account deletion.
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

    const defaultValues = accountQuery.data ? { name: accountQuery.data.name } : { name: "" };

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute-inset-0 inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                        <AccountForm id={id} onSubmit={onSubmit} disabled={isPending} defaultValues={defaultValues} onDelete={onDelete} />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};