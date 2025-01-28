"use client"
import { useMountedState } from "react-use"
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet"
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet"
import { NewCategorySheet } from "@/features/categories/components/new-category-sheet"
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet"
import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet"
import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet"

/**
 * Component that provides various sheets for creating and editing accounts, categories, and transactions.
 * It ensures that the sheets are only rendered when the component is mounted.
 *
 * @returns {JSX.Element | null} The rendered SheetProvider component or null if not mounted.
 */
export const SheetProvider = () => {
    // Hook to check if the component is mounted
    const isMounted = useMountedState();

    // Return null if the component is not mounted
    if (!isMounted) return null;

    return (
        <>
            <NewAccountSheet />
            <EditAccountSheet />
            <NewCategorySheet />
            <EditCategorySheet />
            <NewTransactionSheet />
            <EditTransactionSheet />
        </>
    );
}