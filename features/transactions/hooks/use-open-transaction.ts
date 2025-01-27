import { create } from "zustand";

/**
 * Type definition for the state of the open transaction.
 */
type OpenTransactionState = {
    id?: string;
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
};

/**
 * Zustand store to manage the state of an open transaction.
 *
 * This store includes the following state and actions:
 * - `id`: The ID of the transaction that is open.
 * - `isOpen`: A boolean indicating whether the transaction modal is open.
 * - `onOpen`: A function to open the transaction modal and set the transaction ID.
 * - `onClose`: A function to close the transaction modal and reset the transaction ID.
 */
export const useOpenTransaction = create<OpenTransactionState>((set) => ({
    id: undefined,
    isOpen: false,
    /**
     * Opens the transaction modal and sets the transaction ID.
     *
     * @param {string} id - The ID of the transaction to be set.
     */
    onOpen: (id: string) => set({ isOpen: true, id }),
    /**
     * Closes the transaction modal and resets the transaction ID.
     */
    onClose: () => set({ isOpen: false, id: undefined }),
}));