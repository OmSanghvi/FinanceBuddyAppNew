import { AreaChart, BarChart3, FileSearch, LineChart, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AreaVariant } from "./area-variant";
import { BarVariant } from "./bar-variant";
import { LineVariant } from "./line-variant";
import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "./ui/select";
import { Skeleton } from "./ui/skeleton";

type Props = {
    data?: {
        date: string,
        income: number,
        expenses: number,
    }[];
};

/**
 * Component for rendering a chart with selectable types (area, line, bar).
 *
 * This component displays a chart based on the selected type (area, line, or bar) and the provided data.
 * It also includes a select dropdown to switch between different chart types.
 *
 * @param {Props} props - The properties for the Chart component.
 * @param {Array} [props.data] - The data to be displayed in the chart, each entry containing a date, income, and expenses.
 * @returns {JSX.Element} The rendered Chart component.
 */
export const Chart = ({ data = [] }: Props) => {
    const [chartType, setChartType] = useState("area");

    /**
     * Handles the change of chart type.
     *
     * @param {string} type - The selected chart type.
     */
    const onTypeChange = (type: string) => {
        // TODO: Add paywall
        setChartType(type);
    };

    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <CardTitle className="text-xl line-clamp-1">
                    Transactions
                </CardTitle>
                <Select defaultValue={chartType} onValueChange={onTypeChange}>
                    <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
                        <SelectValue placeholder="Chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="area">
                            <div className="flex items-center">
                                <AreaChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    Area Chart
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="line">
                            <div className="flex items-center">
                                <LineChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    Line Chart
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="bar">
                            <div className="flex items-center">
                                <BarChart3 className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    Bar Chart
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
                        {chartType === "line" && <LineVariant data={data} />}
                        {chartType === "area" && <AreaVariant data={data} />}
                        {chartType === "bar" && <BarVariant data={data} />}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

/**
 * Component for rendering a loading state for the Chart component.
 *
 * This component displays a skeleton loader while the chart data is being loaded.
 *
 * @returns {JSX.Element} The rendered ChartLoading component.
 */
export const ChartLoading = () => {
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