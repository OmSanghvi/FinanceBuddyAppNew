"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
    id: string;
};

/**
 * Component for rendering action buttons for a transaction.
 *
 * This component provides a dropdown menu with options to edit or delete a transaction.
 *
 * @param {Props} props - The component props.
 * @param {string} props.id - The ID of the transaction.
 * @returns {JSX.Element} The rendered actions component.
 */
export const Actions = ({ id }: Props) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this transaction."
    );
    const deleteMutation = useDeleteTransaction(id);
    const { onOpen } = useOpenTransaction();

    /**
     * Handles the delete action for the transaction.
     *
     * This function shows a confirmation dialog and deletes the transaction if confirmed.
     */
    const handleDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate();
        }
    };

    return (
        <>
            <ConfirmDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={() => onOpen(id)}
                    >
                        <Edit className="size-4 mr-2" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={handleDelete}
                    >
                        <Trash className="size-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};