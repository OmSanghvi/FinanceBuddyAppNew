// components/LoadingPage.tsx
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingPage = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
            <Loader className="size-6 text-slate-300 animate-spin" />
        </div>
    );
};

export default LoadingPage;