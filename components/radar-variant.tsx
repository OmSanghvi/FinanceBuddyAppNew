import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";

/**
 * Props for the RadarVariant component.
 *
 * @typedef {Object} Props
 * @property {Object[]} [data] - The data to be displayed in the radar chart.
 * @property {string} data.name - The name of the data entry.
 * @property {number} data.value - The value of the data entry.
 */
type Props = {
    data?: {
        name: string,
        value: number,
    }[];
};

/**
 * RadarVariant component for rendering a radar chart.
 *
 * This component uses the Recharts library to render a responsive radar chart.
 * It displays a radar chart with polar grid, angle axis, and radius axis.
 *
 * @param {Props} props - The properties for the RadarVariant component.
 * @returns {JSX.Element} The rendered RadarVariant component.
 */
export const RadarVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
                <PolarGrid />
                <PolarAngleAxis style={{ fontSize: "12px" }} dataKey="name" />
                <PolarRadiusAxis style={{ fontSize: "12px" }} />
                <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    );
};