import { DataCard } from "@/components/data-card";
import { FaArrowTrendDown } from "react-icons/fa6";

/**
 * Props for the ExpensesCard component.
 *
 * @typedef {Object} ExpensesCardProps
 * @property {Object} data - The data for the expenses.
 * @property {number} data.expensesAmount - The amount of expenses.
 * @property {number} data.expensesChange - The percentage change in expenses.
 * @property {string} dateRange - The date range for the expenses data.
 */
interface ExpensesCardProps {
    data: {
        expensesAmount: number;
        expensesChange: number;
    };
    dateRange: string;
}

/**
 * ExpensesCard component for displaying expenses data in a card format.
 *
 * This component renders a DataCard with the expenses amount, percentage change, and date range.
 *
 * @param {ExpensesCardProps} props - The properties for the ExpensesCard component.
 * @returns {JSX.Element} The rendered ExpensesCard component.
 */
export const ExpensesCard = ({ data, dateRange }: ExpensesCardProps) => (
    <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        dateRange={dateRange}
    />
);