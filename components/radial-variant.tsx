import { RadialBar, RadialBarChart, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#0062FF", "#12C6FF", "#FF647F", "#FF9354"];

/**
 * Props for the RadialVariant component.
 *
 * @typedef {Object} Props
 * @property {Object[]} data - The data to be displayed in the radial bar chart.
 * @property {string} data.name - The name of the data entry.
 * @property {number} data.value - The value of the data entry.
 */
type Props = {
    data: {
        name: string,
        value: number
    }[];
};

/**
 * RadialVariant component for rendering a radial bar chart.
 *
 * This component uses the Recharts library to render a responsive radial bar chart.
 * It displays a legend with custom content and labels inside the bars.
 *
 * @param {Props} props - The properties for the RadialVariant component.
 * @returns {JSX.Element} The rendered RadialVariant component.
 */
export const RadialVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RadialBarChart
                cx="50%"
                cy="50%"
                barSize={10}
                innerRadius="90%"
                outerRadius="40%"
                data={data.map((item, index) => ({
                    ...item,
                    fill: COLORS[index % COLORS.length]
                }))}
            >
                <RadialBar
                    label={{ position: "insideStart", fill: "#fff", fontSize: "12px" }}
                    background
                    dataKey="value"
                />
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="right"
                    iconType="circle"
                    content={({ payload }: any) => {
                        return (
                            <ul className="flex flex-col space-y-2">
                                {payload.map((entry: any, index: number) => (
                                    <li key={`item-${index}`} className="flex items-center space-x-2">
                                        <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                        <div className="space-x-1">
                                            <span className="text-sm text-muted-foreground">
                                                {entry.value}
                                            </span>
                                            <span className="text-sm">
                                                {formatCurrency(entry.payload.value)}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        );
                    }}
                />
            </RadialBarChart>
        </ResponsiveContainer>
    );
};