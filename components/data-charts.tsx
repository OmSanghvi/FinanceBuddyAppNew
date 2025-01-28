"use client"

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { Chart, ChartLoading } from "./chart";
import { SpendingPie, SpendingPieLoading } from "./spending-pie";

/**
 * DataCharts component for rendering charts with summary data.
 *
 * This component fetches summary data and displays it in a grid layout.
 * It shows loading states while the data is being fetched.
 *
 * @returns {JSX.Element} The rendered DataCharts component.
 */
export const DataCharts = () => {
    const {data, isLoading} = useGetSummary();

    if(isLoading){
        return(
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-0">
                <div className="col-span-1 lg:col-span-3 xl:col-span-4 mb-0">
                    <ChartLoading/>
                </div>
                <div className="col-span-1 lg:col-span-3 xl:col-span-2 mb-0">
                    <SpendingPieLoading/>
                </div>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-0">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4 mb-0">
                <Chart data = {data?.days}/>
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-2 mb-0">
                <SpendingPie data={data?.categories}/>
            </div>
        </div>
    );
}