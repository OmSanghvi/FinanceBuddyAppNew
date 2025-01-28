import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * Custom hook to display a confirmation dialog.
 * It provides a component to render the dialog and a function to trigger the confirmation process.
 *
 * @param {string} title - The title of the confirmation dialog.
 * @param {string} message - The message of the confirmation dialog.
 * @returns {[() => JSX.Element, () => Promise<unknown>]} An array containing the ConfirmationDialog component and the confirm function.
 */
export const useConfirm = (title: string, message: string): [() => JSX.Element, () => Promise<unknown>] => {
    // State to store the promise resolver
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

    /**
     * Function to trigger the confirmation process.
     * It returns a promise that resolves to true if confirmed, and false if cancelled.
     *
     * @returns {Promise<boolean>} The promise that resolves to the confirmation result.
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
     * Function to handle the confirmation action.
     * It resolves the promise with true and closes the dialog.
     */
    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    /**
     * Function to handle the cancellation action.
     * It resolves the promise with false and closes the dialog.
     */
    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    /**
     * Component to render the confirmation dialog.
     *
     * @returns {JSX.Element} The rendered ConfirmationDialog component.
     */
    const ConfirmationDialog = () => (
        <Dialog open={promise != null} onOpenChange={handleCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
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