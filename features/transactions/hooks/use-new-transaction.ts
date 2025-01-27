import { create } from "zustand";

/**
 * Type definition for the state of the new transaction.
 */
type NewTransactionState = {
    isOpen: boolean;
    transactionData: any;
    onOpen: (data?: any) => void;
    onClose: () => void;
    setTransactionData: (data: any) => void;
};

/**
 * Zustand store to manage the state of a new transaction.
 *
 * This store includes the following state and actions:
 * - `isOpen`: A boolean indicating whether the new transaction modal is open.
 * - `transactionData`: The data of the transaction being created or edited.
 * - `onOpen`: A function to open the new transaction modal and optionally set the transaction data.
 * - `onClose`: A function to close the new transaction modal and reset the transaction data.
 * - `setTransactionData`: A function to set the transaction data.
 */
export const useNewTransaction = create<NewTransactionState>((set) => ({
    isOpen: false,
    transactionData: null,
    /**
     * Opens the new transaction modal and optionally sets the transaction data.
     *
     * @param {any} [data] - The data of the transaction to be set.
     */
    onOpen: (data) => set({ isOpen: true, transactionData: data || null }),
    /**
     * Closes the new transaction modal and resets the transaction data.
     */
    onClose: () => set({ isOpen: false, transactionData: null }),
    /**
     * Sets the transaction data.
     *
     * @param {any} data - The data of the transaction to be set.
     */
    setTransactionData: (data) => set({ transactionData: data }),
}));