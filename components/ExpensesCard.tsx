import { DataCard } from "@/components/data-card";
import { FaArrowTrendDown } from "react-icons/fa6";

interface ExpensesCardProps {
    data: {
        expensesAmount: number;
        expensesChange: number;
    };
    dateRange: string;
}

export const ExpensesCard = ({ data, dateRange }: ExpensesCardProps) => (
    <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        dateRange={dateRange}
    />
);