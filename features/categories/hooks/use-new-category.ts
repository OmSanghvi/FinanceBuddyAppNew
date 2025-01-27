import {create} from "zustand";

/**
 * Type definition for the state of the new category modal.
 */
type NewCategoryState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

/**
 * Custom hook to manage the state of the new category modal.
 *
 * This hook uses `zustand` to create a store that manages the open/close state of the new category modal.
 *
 * @returns {object} The state and functions to open and close the modal.
 */
export const useNewCategory = create<NewCategoryState>((set) => ({
    /**
     * Indicates whether the new category modal is open.
     */
    isOpen: false,
    /**
     * Function to open the new category modal.
     */
    onOpen: () => set({isOpen: true}),
    /**
     * Function to close the new category modal.
     */
    onClose: () => set({isOpen: false}),
}));