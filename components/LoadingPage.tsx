// components/LoadingPage.tsx
import React from 'react';
import { Loader } from 'lucide-react';

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