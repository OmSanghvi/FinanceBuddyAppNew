'use client'
import { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Button } from "@/components/ui/button";
import { Save, Edit3 } from "lucide-react";
import { Chart } from "@/components/chart";
import { SpendingPie } from "@/components/spending-pie";
import { IncomeCard } from "./IncomeCard";
import { ExpensesCard } from "./ExpensesCard";
import { RemainingCard } from "./RemainingCard";
import Chat from "@/components/chat";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * DashboardClient component for rendering the dashboard with various cards and charts.
 *
 * This component fetches summary data and displays it in a responsive grid layout.
 * It includes income, expenses, remaining balance cards, and charts for data visualization.
 * The layout can be edited and saved to local storage.
 *
 * @returns {JSX.Element | null} The rendered DashboardClient component or null if loading or on the server.
 */
export default function DashboardClient() {
    const { data, isLoading } = useGetSummary();
    const params = useSearchParams();
    const to = params.get("to") || undefined;
    const from = params.get("from") || undefined;
    const accountId = params.get("accountId") || "default";
    const dateRangeLabel = formatDateRange({ to, from });

    const [layouts, setLayouts] = useState({
        lg: [
            { i: "income", x: 0, y: 0, w: 4, h: 2 },
            { i: "expenses", x: 4, y: 0, w: 4, h: 2 },
            { i: "remaining", x: 8, y: 0, w: 4, h: 2 },
            { i: "chart1", x: 0, y: 2, w: 6, h: 4 },
            { i: "chart2", x: 6, y: 2, w: 6, h: 4 }
        ],
        md: [
            { i: "income", x: 0, y: 0, w: 3, h: 2 },
            { i: "expenses", x: 3, y: 0, w: 4, h: 2 },
            { i: "remaining", x: 7, y: 0, w: 3, h: 2 },
            { i: "chart1", x: 0, y: 2, w: 5, h: 4 },
            { i: "chart2", x: 5, y: 2, w: 5, h: 4 }
        ],
        sm: [
            { i: "income", x: 0, y: 0, w: 6, h: 2 },
            { i: "expenses", x: 0, y: 2, w: 6, h: 2 },
            { i: "remaining", x: 0, y: 4, w: 6, h: 2 },
            { i: "chart1", x: 0, y: 6, w: 6, h: 4 },
            { i: "chart2", x: 0, y: 10, w: 6, h: 4 }
        ]
    });

    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const savedLayouts = localStorage.getItem(`dashboardLayouts_${accountId}`);
        if (savedLayouts) {
            setLayouts(JSON.parse(savedLayouts));
        }
    }, [accountId]);

    /**
     * Handles layout changes and saves the layout to state and local storage.
     *
     * @param {Array} currentLayout - The current layout.
     * @param {Object} allLayouts - All layouts for different breakpoints.
     */
    const handleLayoutChange = (currentLayout: any, allLayouts: any) => {
        setLayouts(allLayouts);
        if (!isEditMode) {
            localStorage.setItem(`dashboardLayouts_${accountId}`, JSON.stringify(allLayouts));
        }
    };

    /**
     * Toggles the edit mode and saves the layout to local storage if exiting edit mode.
     */
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        if (isEditMode) {
            localStorage.setItem(`dashboardLayouts_${accountId}`, JSON.stringify(layouts));
        }
    };

    if (typeof window === "undefined") {
        return null; // Render nothing on the server
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 mb-0">
            <div className="flex justify-between items-center mb-4 px-4">
                <Button
                    onClick={toggleEditMode}
                    className="bg-white text-black dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    {isEditMode ? <Save className="mr-2 h-4 w-4" /> : <Edit3 className="mr-2 h-4 w-4" />}
                    {isEditMode ? "Save Layout" : "Edit Layout"}
                </Button>
            </div>

            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768 }}
                cols={{ lg: 12, md: 10, sm: 6 }}
                rowHeight={100}
                onLayoutChange={handleLayoutChange}
                isDraggable={isEditMode}
                isResizable={false}
                containerPadding={[16, 16]}
                margin={[16, 16]}
            >
                <div key="income" className="w-full h-full">
                    {data && <IncomeCard data={data} dateRange={dateRangeLabel} />}
                </div>

                <div key="expenses" className="w-full h-full">
                    {data && <ExpensesCard data={data} dateRange={dateRangeLabel} />}
                </div>

                <div key="remaining" className="w-full h-full">
                    {data && <RemainingCard data={data} dateRange={dateRangeLabel} />}
                </div>

                <div key="chart1" className="w-full h-full">
                    <Chart data={data?.days} />
                </div>

                <div key="chart2" className="w-full h-full">
                    <SpendingPie data={data?.categories} />
                </div>
            </ResponsiveGridLayout>

            <div className="fixed bottom-4 right-4 w-80 h-64">
                <Chat />
            </div>
        </div>
    );
}