'use client';
import './Navbar.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Component for rendering the Navbar.
 *
 * This component displays the navigation bar with links and authentication buttons.
 * It handles mobile responsiveness, floating state on scroll, and sidebar toggling.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
export default function Navbar() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isFloating, setIsFloating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    /**
     * Handles the sign-in button click.
     * Navigates to the sign-in page.
     */
    const handleSignIn = () => {
        router.push('/sign-in');
    };

    /**
     * Handles the sign-up button click.
     * Navigates to the sign-up page.
     */
    const handleSignUp = () => {
        router.push('/sign-up');
    };

    useEffect(() => {
        /**
         * Checks if the viewport width is less than or equal to 768 pixels.
         * Sets the isMobile state accordingly.
         */
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();

        /**
         * Handles the scroll event.
         * Sets the isFloating state based on the scroll position.
         */
        const handleScroll = () => {
            setIsFloating(window.scrollY > 50);
        };

        window.addEventListener('resize', checkMobile);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    /**
     * Toggles the sidebar open/close state.
     * Prevents body scroll when the sidebar is open.
     */
    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);

        if (typeof document !== 'undefined') {
            document.body.style.overflow = !sidebarOpen ? 'hidden' : 'auto';
            document.body.classList.toggle('sidebar-open', !sidebarOpen);
        }
    };

    return (
        <nav className={`navbar ${isFloating ? 'floating' : 'stationary'}`}>
            <div className="logo">Vorifi</div>
            {isMobile ? (
                <>
                    <button className="menu-button" onClick={toggleSidebar}>
                        ☰
                    </button>
                    <div
                        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
                        style={{
                            pointerEvents: sidebarOpen ? 'auto' : 'none',
                            visibility: sidebarOpen ? 'visible' : 'hidden',
                        }}
                    >
                        <button className="close-button" onClick={toggleSidebar}>
                            ✕
                        </button>

                        <Link href="/home">
                            <div style={{ zIndex: 1000 }}>
                                Home
                            </div>
                        </Link>
                        <div className="auth-buttons">
                            <button
                                className="sign-in"
                                onClick={() => {
                                    toggleSidebar();
                                    handleSignIn();
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                className="sign-up"
                                onClick={() => {
                                    toggleSidebar();
                                    handleSignUp();
                                }}
                                data-color
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="links">
                        <a className="ml-10" href="#AboutMe" data-color>
                            About
                        </a>
                        <a className="ml-10" href="#Skills" data-color>
                            Features
                        </a>
                        <a className="ml-10" href="#contact" data-color>
                            Contact
                        </a>
                    </div>
                    <div className="auth-buttons">
                        <button className="sign-in" onClick={handleSignIn} data-color>
                            Sign In
                        </button>
                        <button className="sign-up" onClick={handleSignUp} data-color>
                            Sign Up
                        </button>
                    </div>
                </>
            )}
        </nav>
    );
}