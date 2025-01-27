'use client'
import { useState } from "react";
import { SettingsCard } from "@/app/(dashboard)/settings/settings-card";
import Chat from "@/components/chat";
import LoadingPage from "@/components/LoadingPage";

/**
 * Component for rendering the settings page.
 *
 * This component displays the settings card and chat component. It also handles the loading state.
 *
 * @returns {JSX.Element} The rendered settings page component.
 */
const SettingsPage = () => {
    const [isLoading] = useState(false);

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