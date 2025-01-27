import {create} from "zustand";

/**
 * Type definition for the state of the open account modal.
 */
type OpenAccountState = {
    /**
     * The ID of the account to be opened.
     */
    id?: string;
    /**
     * Indicates whether the open account modal is open.
     */
    isOpen: boolean;
    /**
     * Function to open the account modal with a specific account ID.
     *
     * @param {string} id - The ID of the account to be opened.
     */
    onOpen: (id: string) => void;
    /**
     * Function to close the open account modal.
     */
    onClose: () => void;
};

/**
 * Custom hook to manage the state of the open account modal.
 *
 * This hook uses `zustand` to create a state store for managing the open/close state of the open account modal.
 *
 * @returns {OpenAccountState} The state and functions to manage the open account modal.
 */
export const useOpenAccount = create<OpenAccountState>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({isOpen: true, id}),
    onClose: () => set({isOpen: false, id: undefined}),
}));