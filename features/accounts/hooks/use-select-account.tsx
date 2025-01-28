import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetAccounts } from "../api/use-get-accounts";
import { useCreateAccount } from "../api/use-create-account";
import { Select } from "@/components/select";

/**
 * Custom hook for selecting an account.
 *
 * This hook provides a confirmation dialog for selecting an account from a list of accounts.
 * It also allows creating a new account if needed.
 *
 * @returns {[() => JSX.Element, () => Promise<unknown>]} An array containing the ConfirmationDialog component and the confirm function.
 */
export const useSelectAccount = (): [() => JSX.Element, () => Promise<unknown>] => {
    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();

    /**
     * Function to handle the creation of a new account.
     *
     * @param {string} name - The name of the new account.
     */
    const onCreateAccount = (name: string) => accountMutation.mutate({ name });

    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));

    const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(null);
    const selectValue = useRef<string>();

    /**
     * Function to confirm the account selection.
     *
     * @returns {Promise<unknown>} A promise that resolves with the selected account value.
     */
    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve });
    });

    /**
     * Function to handle the closing of the dialog.
     */
    const handleClose = () => {
        setPromise(null);
    };

    /**
     * Function to handle the confirmation of the selected account.
     */
    const handleConfirm = () => {
        promise?.resolve(selectValue.current);
        handleClose();
    };

    /**
     * Function to handle the cancellation of the dialog.
     */
    const handleCancel = () => {
        promise?.resolve(undefined);
        handleClose();
    };

    /**
     * ConfirmationDialog component for displaying the account selection dialog.
     *
     * @returns {JSX.Element} The rendered ConfirmationDialog component.
     */
    const ConfirmationDialog = () => (
        <Dialog open={promise != null} onOpenChange={handleCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Select Account
                    </DialogTitle>
                    <DialogDescription>
                        Please select an account to continue.
                    </DialogDescription>
                </DialogHeader>
                <Select
                    placeholder="Select an account"
                    options={accountOptions}
                    onCreate={onCreateAccount}
                    onChange={(value) => selectValue.current = value}
                    disabled={accountQuery.isLoading || accountMutation.isPending}
                />
                <DialogFooter className="pt-2">
                    <Button onClick={handleCancel} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [ConfirmationDialog, confirm];
};