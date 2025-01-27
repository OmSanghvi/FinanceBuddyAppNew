import {create} from "zustand";

/**
 * Type definition for the state of the open category modal.
 */
type OpenCategoryState = {
    /**
     * The ID of the category to be opened.
     */
    id?: string;
    /**
     * Indicates whether the open category modal is open.
     */
    isOpen: boolean;
    /**
     * Function to open the category modal with a specific ID.
     *
     * @param {string} id - The ID of the category to be opened.
     */
    onOpen: (id: string) => void;
    /**
     * Function to close the category modal.
     */
    onClose: () => void;
};

/**
 * Custom hook to manage the state of the open category modal.
 *
 * This hook uses `zustand` to create a store that manages the open/close state of the open category modal.
 *
 * @returns {object} The state and functions to open and close the modal.
 */
export const useOpenCategory = create<OpenCategoryState>((set) => ({
    /**
     * The ID of the category to be opened, initially undefined.
     */
    id: undefined,
    /**
     * Indicates whether the open category modal is open, initially false.
     */
    isOpen: false,
    /**
     * Function to open the category modal with a specific ID.
     *
     * @param {string} id - The ID of the category to be opened.
     */
    onOpen: (id: string) => set({isOpen: true, id}),
    /**
     * Function to close the category modal and reset the ID.
     */
    onClose: () => set({isOpen: false, id: undefined}),
}));