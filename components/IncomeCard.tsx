import { DataCard } from "@/components/data-card";
import { FaArrowTrendUp } from "react-icons/fa6";

interface IncomeCardProps {
    data: {
        incomeAmount: number;
        incomeChange: number;
    };
    dateRange: string;
}

export const IncomeCard = ({ data, dateRange }: IncomeCardProps) => (
    <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        dateRange={dateRange}
    />
);