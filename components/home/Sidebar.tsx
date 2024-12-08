'use client'
import '../sidebar.css';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';

const AwesomeSidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);

        // Prevent scrolling when sidebar is open
        if (!isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    // Particle effect for sidebar open/close
    const renderParticles = () => {
        return Array.from({ length: 20 }).map((_, index) => (
            <motion.div
                key={index}
                className="particle"
                initial={{
                    opacity: 0,
                    scale: 0,
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100
                }}
                animate={{
                    opacity: isOpen ? [0, 1, 0] : 0,
                    scale: isOpen ? [0, 1, 0] : 0,
                    x: isOpen ? 0 : Math.random() * 200 - 100,
                    y: isOpen ? 0 : Math.random() * 200 - 100
                }}
                transition={{
                    duration: 1.5,
                    repeat: 0,
                    type: "spring",
                    stiffness: 100
                }}
                style={{
                    position: 'absolute',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                    zIndex: 1000
                }}
            />
        ));
    };

    return (
        <>
            {/* Hamburger Menu Button */}
            <motion.button
                onClick={toggleSidebar}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed top-5 right-5 z-[1003] bg-[#ffc75f] p-3 rounded-full shadow-xl"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            {/* Sidebar with Spectacular Transition */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{
                            x: '100%',
                            clipPath: 'circle(0% at 100% 0%)'
                        }}
                        animate={{
                            x: 0,
                            clipPath: 'circle(150% at 100% 0%)',
                            transition: {
                                type: 'spring',
                                damping: 15,
                                stiffness: 100,
                                duration: 0.7
                            }
                        }}
                        exit={{
                            x: '100%',
                            clipPath: 'circle(0% at 100% 0%)',
                            transition: {
                                type: 'spring',
                                damping: 20,
                                stiffness: 200
                            }
                        }}
                        className="fixed top-0 right-0 w-full h-full bg-[#ffc75f] z-[1002] flex flex-col justify-center items-center"
                    >
                        {/* Particles Effect */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {renderParticles()}
                        </div>

                        {/* Sidebar Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: {
                                    delay: 0.3,
                                    type: 'spring',
                                    stiffness: 100
                                }
                            }}
                            className="text-center space-y-8"
                        >
                            <motion.h2
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="text-5xl font-bold text-white mb-12"
                            >
                                VORIFI
                            </motion.h2>

                            {['About', 'Features', 'Contact'].map((item, index) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={toggleSidebar}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        transition: {
                                            delay: 0.4 + index * 0.1,
                                            type: 'spring',
                                            stiffness: 100
                                        }
                                    }}
                                    className="block text-3xl text-white hover:text-[#102E4A] transition-colors duration-300 mb-6"
                                >
                                    {item}
                                </motion.a>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        delay: 0.7,
                                        type: 'spring',
                                        stiffness: 100
                                    }
                                }}
                                className="flex justify-center space-x-4 mt-12"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-[#ffc75f] px-6 py-3 rounded-full text-xl"
                                >
                                    Sign In
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-[#ffc75f] px-6 py-3 rounded-full text-xl"
                                >
                                    Sign Up
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AwesomeSidebar;