import { DataCard } from "@/components/data-card";
import { FaPiggyBank } from "react-icons/fa";

/**
 * Props for the RemainingCard component.
 *
 * @typedef {Object} RemainingCardProps
 * @property {Object} data - The data for the remaining amount and change.
 * @property {number} data.remainingAmount - The remaining amount.
 * @property {number} data.remainingChange - The percentage change in the remaining amount.
 * @property {string} dateRange - The date range for the data.
 */
interface RemainingCardProps {
    data: {
        remainingAmount: number;
        remainingChange: number;
    };
    dateRange: string;
}

/**
 * RemainingCard component for displaying the remaining amount and its change.
 *
 * This component renders a data card with the remaining amount, its percentage change,
 * an icon, and the date range.
 *
 * @param {RemainingCardProps} props - The properties for the RemainingCard component.
 * @returns {JSX.Element} The rendered RemainingCard component.
 */
export const RemainingCard = ({ data, dateRange }: RemainingCardProps) => (
    <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        dateRange={dateRange}
    />
);