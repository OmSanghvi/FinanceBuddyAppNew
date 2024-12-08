"use client"
import './hero.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import img from './img.png'; // Adjust the path as necessary

export default function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { clientX, clientY, currentTarget } = event;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = clientX - left - width / 2;
        const y = clientY - top - height / 2;

        // Check if the mouse is within the bounds of the image
        if (clientX >= left && clientX <= left + width && clientY >= top && clientY <= top + height) {
            setMousePosition({ x, y });
        } else {
            setMousePosition({ x: 0, y: 0 });
        }
    };

    const calcRotation = (x: number, y: number) => {
        const maxTilt = 1; // Further reduced maximum tilt angle
        const tiltX = -(y / 100) * maxTilt; // Inverted tilt
        const tiltY = -(x / 100) * maxTilt; // Inverted tilt
        return { rotateX: tiltX, rotateY: tiltY };
    };

    return (
        <div className="hero">
            <div className="hero-text">
                <h1 className="title-text">Welcome to</h1>
                <h1 className="main-text">VORIFI</h1>
                <h2 className="welcome-text">The only fully customizable financial application to manage all your finances all in one place.</h2>
                <button className="get-started-button">Get Started</button>
            </div>
            <div className="image-container">
                <motion.div
                    className="tilt-container"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        perspective: 1000,
                        width: '1200px', // Increase the width to 2x
                        height: 'auto', // Maintain aspect ratio
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '20px', // Add some margin to separate from the text
                    }}
                >
                    <motion.img
                        src={img.src} // Access the src property of the imported image
                        alt="Tilt Effect"
                        className="tilt-image"
                        style={{ width: '75%', height: 'auto', borderRadius: '10px' }} // Maintain aspect ratio
                        animate={isHovered ? calcRotation(mousePosition.x, mousePosition.y) : { rotateX: 0, rotateY: 0 }}
                        whileHover={{ scale: 1.1 }} // Slightly increase the size on hover
                        transition={{ type: 'spring', stiffness: 300, damping: 20, duration: isHovered ? 0.3 : 1 }}
                    />
                </motion.div>
            </div>
        </div>
    );
}