import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import { formatPercentage } from "@/lib/utils";
import { CategoryTooltip } from "./category-tooltip";

const COLORS = ["#0062FF", "#12C6FF", "#FF647F", "#FF9354"];

/**
 * Props for the PieVariant component.
 *
 * @typedef {Object} Props
 * @property {Object[]} data - The data to be displayed in the pie chart.
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
 * PieVariant component for rendering a pie chart with custom tooltips and legends.
 *
 * This component uses the Recharts library to render a responsive pie chart.
 * It displays a legend with custom content and a tooltip for each category.
 *
 * @param {Props} props - The properties for the PieVariant component.
 * @returns {JSX.Element} The rendered PieVariant component.
 */
export const PieVariant = ({data}: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="right"
                    iconType="circle"
                    content={({payload}: any) => {
                        return (
                            <ul className="flex flex-col space-y-2">
                                {payload.map((entry: any, index: number) => (
                                    <li key={`item-${index}`} className="flex items-center space-x-2">
                                        <span className="size-2 rounded-full" style={{backgroundColor: entry.color}}/>
                                        <div className="space-x-1">
                                            <span className="text-sm text-muted-foreground">
                                                {entry.value}
                                            </span>
                                            <span className="text-sm">
                                                {formatPercentage(entry.payload.percent * 100)}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        );
                    }}
                />
                <Tooltip content={<CategoryTooltip/>}/>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={60}
                    paddingAngle={2}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                >
                    {data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};