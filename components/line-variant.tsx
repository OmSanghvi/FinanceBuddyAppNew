import { format } from "date-fns";
import { Tooltip, XAxis, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { CustomTooltip } from "./custom-tooltip";

/**
 * Props for the LineVariant component.
 *
 * @typedef {Object} Props
 * @property {Array<Object>} data - The data for the chart.
 * @property {string} data.date - The date of the data point.
 * @property {number} data.income - The income value of the data point.
 * @property {number} data.expenses - The expenses value of the data point.
 */
type Props = {
    data: {
        date: string;
        income: number;
        expenses: number;
    }[];
};

/**
 * LineVariant component for displaying a line chart with income and expenses data.
 *
 * This component renders a responsive line chart using the Recharts library.
 * It includes a Cartesian grid, X-axis, and tooltips with custom formatting.
 *
 * @param {Props} props - The properties for the LineVariant component.
 * @returns {JSX.Element} The rendered LineVariant component.
 */
export const LineVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
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
                <Line
                    dot={false}
                    dataKey="income"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    className="drop-shadow-sm"
                />
                <Line
                    dot={false}
                    dataKey="expenses"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    className="drop-shadow-sm"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};