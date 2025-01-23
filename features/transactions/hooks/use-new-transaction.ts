
import { create } from "zustand";

type NewTransactionState = {
    isOpen: boolean;
    transactionData: any;
    onOpen: (data?: any) => void;
    onClose: () => void;
    setTransactionData: (data: any) => void;
};

export const useNewTransaction = create<NewTransactionState>((set) => ({
    isOpen: false,
    transactionData: null,
    onOpen: (data) => set({ isOpen: true, transactionData: data || null }),
    onClose: () => set({ isOpen: false, transactionData: null }),
    setTransactionData: (data) => set({ transactionData: data }),
}));