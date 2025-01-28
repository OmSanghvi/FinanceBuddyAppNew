"use client";

import { useDeleteConnectedBank } from "@/features/plaid/api/use-delete-connected-bank";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";

/**
 * Component for disconnecting a connected bank account.
 * It prompts the user for confirmation before disconnecting the bank account and removing all associated data.
 *
 * @returns {JSX.Element} The rendered PlaidDisconnect component.
 */
export const PlaidDisconnect = () => {
    // Hook to use a confirmation dialog
    const [Dialog, confirm] = useConfirm(
        "Are you sure?",
        "This will disconnect your bank account and remove all associated data."
    );

    // Hook to delete the connected bank account
    const deleteConnectedBank = useDeleteConnectedBank();

    /**
     * Handles the button click to disconnect the bank account.
     * It shows a confirmation dialog and, if confirmed, deletes the connected bank account.
     */
    const onClick = async () => {
        const ok = await confirm();

        if (ok) {
            deleteConnectedBank.mutate();
        }
    };

    return (
        <>
            <Dialog />
            <Button
                onClick={onClick}
                disabled={deleteConnectedBank.isPending}
                size="sm"
                variant="ghost"
            >
                Disconnect
            </Button>
        </>
    )
}