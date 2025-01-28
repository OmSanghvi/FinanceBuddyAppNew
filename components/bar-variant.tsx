import { format } from "date-fns";
import { Tooltip, XAxis, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import { CustomTooltip } from "./custom-tooltip";

type Props = {
    data: {
        date: string,
        income: number,
        expenses: number,
    }[];
};

/**
 * Component for rendering a bar chart with income and expenses data.
 *
 * This component displays a bar chart using Recharts, with bars for income and expenses.
 * It also includes a custom tooltip and formatted X-axis labels.
 *
 * @param {Props} props - The properties for the BarVariant component.
 * @param {Array} props.data - The data to be displayed in the chart, each entry containing a date, income, and expenses.
 * @returns {JSX.Element} The rendered BarVariant component.
 */
export const BarVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey="date"
                    tickFormatter={(value) => format(value, "dd MMMM")}
                    style={{ fontSize: "12px" }}
                    tickMargin={16}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#3b82f6" className="drop-shadow-sm" />
                <Bar dataKey="expenses" fill="#f43f5e" className="drop-shadow-sm" />
            </BarChart>
        </ResponsiveContainer>
    );
};