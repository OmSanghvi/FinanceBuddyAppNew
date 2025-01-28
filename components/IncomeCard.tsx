import { DataCard } from "@/components/data-card";
import { FaArrowTrendUp } from "react-icons/fa6";

/**
 * Props for the IncomeCard component.
 *
 * @typedef {Object} IncomeCardProps
 * @property {Object} data - The data for the income.
 * @property {number} data.incomeAmount - The amount of income.
 * @property {number} data.incomeChange - The percentage change in income.
 * @property {string} dateRange - The date range for the income data.
 */
interface IncomeCardProps {
    data: {
        incomeAmount: number;
        incomeChange: number;
    };
    dateRange: string;
}

/**
 * IncomeCard component for displaying income data in a card format.
 *
 * This component renders a DataCard with the income amount, percentage change, and date range.
 *
 * @param {IncomeCardProps} props - The properties for the IncomeCard component.
 * @returns {JSX.Element} The rendered IncomeCard component.
 */
export const IncomeCard = ({ data, dateRange }: IncomeCardProps) => (
    <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        dateRange={dateRange}
    />
);