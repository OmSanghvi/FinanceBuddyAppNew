'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarItem } from '@/components/navigation';
import { Header } from '@/components/header';
import Sidebar from '@/components/navigation';
import Link from 'next/link';
import { MdDashboard, MdAccountBalance, MdCategory, MdSettings, MdReceipt } from "react-icons/md";
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { useMedia } from "react-use";

type Props = {
    children: React.ReactNode;
};

/**
 * Component for rendering the dashboard layout.
 *
 * This component provides the layout for the dashboard, including the sidebar and header.
 *
 * @param {Props} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The rendered dashboard layout component.
 */
const DashboardLayout = ({ children }: Props) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [currentPath, setCurrentPath] = useState('');
    const isMobile = useMedia("(max-width: 1024px)", false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setCurrentPath(pathname);
    }, [pathname]);

    useEffect(() => {
        console.log('Debug Info:', { isMobile, isOpen, pathname });
    }, [isMobile, isOpen, pathname]);

    const routes = [
        { href: "/", label: "Overview" },
        { href: "/transactions", label: "Transactions" },
        { href: "/accounts", label: "Accounts" },
        { href: "/categories", label: "Categories" },
        { href: "/settings", label: "Settings" }
    ];

    /**
     * Handles the click event for navigation links.
     *
     * @param {string} href - The URL to navigate to.
     */
    const onClick = (href: string) => {
        setIsOpen(false);
        window.location.href = href;
    };

    if (isMobile) {
        return (
            <>
                <Header/>
                <main className="px-3 lg:px-14">
                    {children}
                </main>
            </>
        )
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar expanded={isSidebarExpanded} setExpanded={setIsSidebarExpanded}>
                {routes.map((route) => (
                    <Link href={route.href} key={route.href}>
                        <SidebarItem
                            icon={
                                route.href === '/' ? <MdDashboard /> :
                                    route.href === '/transactions' ? <MdReceipt /> :
                                        route.href === '/accounts' ? <MdAccountBalance /> :
                                            route.href === '/categories' ? <MdCategory /> :
                                                <MdSettings />
                            }
                            text={route.label}
                            active={currentPath === route.href}
                            alert={false}
                            iconSize={38}
                        />
                    </Link>
                ))}
            </Sidebar>

            {/* Main Content */}
            <div className={`flex-1 transition-all ${isSidebarExpanded ? 'ml-64' : 'ml-16'}`}>
                <Header />
                <main className="px-3 lg:px-14">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;