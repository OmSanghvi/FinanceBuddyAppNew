// pages/index.tsx
"use client";
import { useState } from "react";
import AIPanel from "@/components/AIPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

/**
 * Chat component for rendering a button to toggle the AI panel.
 *
 * This component includes a button that toggles the visibility of the AI panel.
 * The button is fixed at the bottom-right corner of the screen.
 *
 * @returns {JSX.Element} The rendered Chat component.
 */
export default function Chat() {
    const [isPanelOpen, setPanelOpen] = useState(false);

    /**
     * Toggles the AI panel visibility.
     */
    const togglePanel = () => {
        setPanelOpen((prev) => !prev);
    };

    return (
        <main>
            <button
                onClick={togglePanel}
                className="fixed bottom-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg"
            >
                <FontAwesomeIcon icon={faRobot} className="text-white" size="lg" />
            </button>
            <AIPanel isOpen={isPanelOpen} onClose={togglePanel}/>
        </main>
    );
}