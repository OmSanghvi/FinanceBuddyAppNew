'use client';
import './Navbar.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isFloating, setIsFloating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const handleSignIn = () => {
        router.push('/sign-in');
    };

    const handleSignUp = () => {
        router.push('/sign-up');
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();

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
