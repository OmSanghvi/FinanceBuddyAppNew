'use client'
import { useState, useEffect } from "react";
import DashboardClient from "@/components/DashboardClient";
import LoadingPage from "@/components/LoadingPage";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

/**
 * Component for rendering the dashboard page.
 *
 * This component fetches the summary data and displays either a loading page or the dashboard client based on the loading state.
 *
 * @returns {JSX.Element} The rendered dashboard page component.
 */
export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const dashboardDataQuery = useGetSummary();

    useEffect(() => {
        if (!dashboardDataQuery.isLoading) {
            setIsLoading(false);
        }
    }, [dashboardDataQuery.isLoading]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return <DashboardClient />;
}