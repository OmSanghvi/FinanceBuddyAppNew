'use client'
import { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import Contact from "@/components/home/Contact"
import AboutMe from "@/components/home/AboutMe";
import Skills from "@/components/home/Skills";

export default function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // Simulate a loading time of 2 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center">
            <Navbar />
            <Hero />
            <Contact />
            <AboutMe />
            <Skills />
        </div>
    );
}