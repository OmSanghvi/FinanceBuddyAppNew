import {create} from "zustand";

/**
 * Type definition for the state of the new account modal.
 */
type NewAccountState = {
    /**
     * Indicates whether the new account modal is open.
     */
    isOpen: boolean;
    /**
     * Function to open the new account modal.
     */
    onOpen: () => void;
    /**
     * Function to close the new account modal.
     */
    onClose: () => void;
};

/**
 * Custom hook to manage the state of the new account modal.
 *
 * This hook uses `zustand` to create a state store for managing the open/close state of the new account modal.
 *
 * @returns {NewAccountState} The state and functions to manage the new account modal.
 */
export const useNewAccount = create<NewAccountState>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}));