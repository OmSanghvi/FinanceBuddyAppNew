import { FileSearch, Loader2, PieChart, Radar, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "./ui/select";
import { PieVariant } from "./pie-variant";
import { RadarVariant } from "./radar-variant";
import { RadialVariant } from "./radial-variant";
import { Skeleton } from "./ui/skeleton";

/**
 * Props for the SpendingPie component.
 *
 * @typedef {Object} Props
 * @property {Object[]} [data] - The data to be displayed in the chart.
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
 * SpendingPie component for rendering different types of charts based on the selected chart type.
 *
 * This component uses the lucide-react and custom UI components to render a card with a selectable chart type.
 * It displays a pie chart, radar chart, or radial chart based on the selected type.
 *
 * @param {Props} props - The properties for the SpendingPie component.
 * @returns {JSX.Element} The rendered SpendingPie component.
 */
export const SpendingPie = ({ data = [] }: Props) => {
    const [chartType, setChartType] = useState("pie");
    const onTypeChange = (type: string) => {
        // TODO: Add paywall
        setChartType(type);
    };
    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <CardTitle className="text-xl line-clamp-1">
                    Categories
                </CardTitle>
                <Select defaultValue={chartType} onValueChange={onTypeChange}>
                    <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
                        <SelectValue placeholder="Chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pie">
                            <div className="flex items-center">
                                <PieChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    Pie Chart
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="radar">
                            <div className="flex items-center">
                                <Radar className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    Radar Chart
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="radial">
                            <div className="flex items-center">
                                <Target className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    Radial Chart
                                </p>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
                        <FileSearch className="size-6 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                            No data for this period
                        </p>
                    </div>
                ) : (
                    <>
                        {chartType === "pie" && <PieVariant data={data} />}
                        {chartType === "radar" && <RadarVariant data={data} />}
                        {chartType === "radial" && <RadialVariant data={data} />}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

/**
 * SpendingPieLoading component for displaying a loading state for the SpendingPie component.
 *
 * This component renders a card with skeleton loaders to indicate that the SpendingPie component is loading.
 *
 * @returns {JSX.Element} The rendered SpendingPieLoading component.
 */
export const SpendingPieLoading = () => {
    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 lg:w-[120px] w-full" />
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
                </div>
            </CardContent>
        </Card>
    );
};