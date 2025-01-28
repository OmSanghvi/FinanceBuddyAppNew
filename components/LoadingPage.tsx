import React from 'react';
import { Loader } from 'lucide-react';

/**
 * LoadingPage component for displaying a loading screen.
 *
 * This component renders a full-screen overlay with a loading animation.
 * It is intended to be used while waiting for data to load or an operation to complete.
 *
 * @returns {JSX.Element} The rendered LoadingPage component.
 */
const LoadingPage = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 z-50">
            <div className="dots">
                {/* Add your loading dots or spinner here */}
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    );
};

export default LoadingPage;