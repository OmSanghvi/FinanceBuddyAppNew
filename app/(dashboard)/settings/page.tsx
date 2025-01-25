'use client'
import { useState, useEffect } from "react";
import { SettingsCard } from "@/app/(dashboard)/settings/settings-card";
import Chat from "@/components/chat";
import LoadingPage from "@/components/LoadingPage";
import { useGetSettings } from "@/features/settings/api/use-get-settings";

const SettingsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const settingsQuery = useGetSettings();

    useEffect(() => {
        if (!settingsQuery.isLoading) {
            setIsLoading(false);
        }
    }, [settingsQuery.isLoading]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <SettingsCard />
            <Chat />
        </div>
    );
}

export default SettingsPage;