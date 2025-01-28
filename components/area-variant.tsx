import { Tooltip, XAxis, AreaChart, Area, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { CustomTooltip } from "./custom-tooltip";

type Props = {
    data: {
        date: string,
        income: number,
        expenses: number
    }[]
}

/**
 * Component for rendering an area chart with income and expenses data.
 *
 * This component displays an area chart using Recharts, with custom gradients for income and expenses.
 * It also includes a custom tooltip and formatted X-axis labels.
 *
 * @param {Props} props - The properties for the AreaVariant component.
 * @param {Array} props.data - The data to be displayed in the chart, each entry containing a date, income, and expenses.
 * @returns {JSX.Element} The rendered AreaVariant component.
 */
export const AreaVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <defs>
                    <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="2%" stopColor="#3d82f6" stopOpacity={0.8} />
                        <stop offset="98%" stopColor="#3d82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="2%" stopColor="#f43f5e" stopOpacity={0.8} />
                        <stop offset="98%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey="date"
                    tickFormatter={(value) => format(value, "dd MMMM")}
                    style={{ fontSize: "12px" }}
                    tickMargin={16}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="income"
                    stackId="income"
                    strokeWidth={2}
                    stroke="#3d82f6"
                    fill="url(#income)"
                    className="drop-shadow-sm"
                />
                <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="expenses"
                    strokeWidth={2}
                    stroke="#f43f5e"
                    fill="url(#expenses)"
                    className="drop-shadow-sm"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}