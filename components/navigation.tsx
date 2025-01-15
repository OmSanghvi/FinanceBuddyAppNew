import React, { useContext, createContext, ReactNode, useEffect } from "react";
import { ClerkLoaded, ClerkLoading, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ChevronLast, ChevronFirst, MoreVertical, Loader2, Sun, Moon } from "lucide-react";
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMedia } from "react-use";
import { Button } from '@/components/ui/button';

const routes = [
    { href: "/", label: "Overview" },
    { href: "/transactions", label: "Transactions" },
    { href: "/accounts", label: "Accounts" },
    { href: "/categories", label: "Categories" },
    { href: "/settings", label: "Settings" }
];

const userButtonAppearance = {
    elements: {
        userButtonAvatarBox: "w-10 h-10", // Custom width and height
        userButtonPopoverCard: "bg-blue-100", // Custom background for the popover card
        userButtonPopoverActionButton: "text-red-600", // Custom text color for action buttons
    },
};

const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

interface SidebarProps {
    children: ReactNode;
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
}

interface SidebarItemProps {
    icon: ReactNode;
    text: string;
    active: boolean;
    alert: boolean;
    iconSize?: number;
}

export function SidebarItem({ icon, text, active, alert, iconSize = 24 }: SidebarItemProps) {
    const { expanded } = useContext(SidebarContext);
    return (
        <li
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
                active ? "bg-blue-500 text-white dark:bg-blue-700 dark:text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
            }`}
        >
            <div
                className={`flex items-center justify-center transition-all ${expanded ? "" : "w-full justify-center mx-auto"}`}
                style={{ width: iconSize, height: iconSize }}>
                {React.cloneElement(icon as React.ReactElement, { size: iconSize })}
            </div>
            <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                {text}
            </span>
            {alert && (
                <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />
            )}
            {!expanded && (
                <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-200 dark:bg-gray-600 text-black dark:text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                    {text}
                </div>
            )}
        </li>
    );
}

export default function Sidebar({ children, expanded, setExpanded }: SidebarProps) {
    const { user } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const isMobile = useMedia("(max-width: 1024px)", false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);

    const onClick = (href: string) => {
        router.push(href);
        if (isMobile) {
            setExpanded(false);
        }
    };

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <aside className={`h-screen fixed left-0 top-0 transition-all ${expanded ? 'w-64' : 'w-22'} ${expanded ? 'z-50' : 'z-10'} dark:bg-gray-800`}>
            <nav className={`h-full flex flex-col bg-white dark:bg-gray-800 border-r shadow-sm ${expanded || !isMobile ? 'block' : 'hidden'}`}>
                <div className="p-4 pb-2 flex justify-between items-center">
                    <Link href="/">
                        <div className='items-start justify-start hidden lg:flex'>
                            <Image src={isDarkMode ? "/logo.svg" : "/darklogo.svg"} alt="Logo" height={30} width={28} />
                            {expanded && (
                                <p className='font-semibold text-Black dark:text-white text-3xl ml-2.5'>
                                    Vorifi
                                </p>
                            )}
                        </div>
                    </Link>
                    {!isMobile && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            {expanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    )}
                    {isMobile && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            Close
                        </button>
                    )}
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>
                <div className="sticky bottom-0 w-full p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                    <Button
                        key={isDarkMode ? "dark-mode" : "light-mode"} // Ensure re-render on state change
                        onClick={toggleDarkMode}
                        className={`w-full flex justify-center items-center py-2
        ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}
        ${isMobile ? 'mobile-theme-button' : 'hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'}
    `}
                        variant="outline"
                    >
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                </div>

                {!isMobile && (
                    <div className="border-t flex p-3 dark:border-gray-700">
                        <div className={`flex justify-center items-center transition-all ${expanded ? "w-52 ml-3" : "w-16 justify-center"}`}>
                            <div className="leading-4 flex items-center justify-center w-full">
                                <ClerkLoaded>
                                    <UserButton appearance={userButtonAppearance} afterSignOutUrl="/home" />
                                    {expanded && user && (
                                        <span className="ml-2 transition-opacity duration-300 opacity-100 dark:text-white">
                                            {user.fullName}
                                        </span>
                                    )}
                                </ClerkLoaded>
                                <ClerkLoading>
                                    <Loader2 className="size-8 animate-spin text-slate-400" />
                                </ClerkLoading>
                            </div>
                            {expanded && <MoreVertical size={20} className="dark:text-white" />}
                        </div>
                    </div>
                )}
            </nav>
        </aside>
    );
}
