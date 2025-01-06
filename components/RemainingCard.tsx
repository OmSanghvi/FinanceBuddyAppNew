import { DataCard } from "@/components/data-card";
import { FaPiggyBank } from "react-icons/fa";

interface RemainingCardProps {
    data: {
        remainingAmount: number;
        remainingChange: number;
    };
    dateRange: string;
}

export const RemainingCard = ({ data, dateRange }: RemainingCardProps) => (
    <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        dateRange={dateRange}
    />
);