import React from 'react';

/**
 * HomePage component for displaying the home page of the application.
 *
 * This component includes the header, hero section, value proposition, features, and call to action sections.
 * It also includes general styles for the page.
 *
 * @returns {JSX.Element} The rendered HomePage component.
 */
export const HomePage = () => {
    return (
        <>
            <style>
                {`
                /* General Reset and Styles */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f9fafb;
                    color: #333;
                }
                a {
                    text-decoration: none;
                    color: inherit;
                }

                /* Header Section */
                header {
                    background-color: #fff;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                }
                .logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #3b82f6;
                }
                .auth-buttons {
                    display: flex;
                    gap: 10px;
                }
                .auth-buttons button, .auth-buttons a {
                    padding: 10px 20px;
                    border: 2px solid #3b82f6;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                }
                .auth-buttons button {
                    background-color: #3b82f6;
                    color: #fff;
                }
                .auth-buttons a {
                    background-color: transparent;
                    color: #3b82f6;
                }

                /* Hover Effects for Buttons */
                button, a.button {
                    padding: 15px 30px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .cta-signup {
                    background-color: #3b82f6;
                    color: white;
                    border: 2px solid #3b82f6;
                }
                .cta-signup:hover {
                    background-color: #2563eb;
                    transform: scale(1.05);
                }
                .cta-login, .auth-buttons a {
                    background-color: transparent;
                    color: #3b82f6;
                    border: 2px solid #3b82f6;
                }
                .cta-login:hover, .auth-buttons a:hover {
                    background-color: #3b82f6;
                    color: white;
                    transform: scale(1.05);
                }

                /* Hero Section */
                .hero {
                    background: url('hero-image.jpg') no-repeat center center/cover;
                    padding: 100px 20px;
                    text-align: center;
                    background-attachment: fixed;
                    color: #333;
                }
                .hero h1 {
                    font-size: 48px;
                    margin-bottom: 20px;
                    color: #333;
                }
                .hero p {
                    font-size: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                    margin-bottom: 40px;
                    line-height: 1.5;
                    color: #333;
                }

                /* Value Proposition */
                .value-proposition {
                    padding: 80px 20px;
                    background-color: #f3f4f6;
                }
                .value-proposition h2 {
                    text-align: center;
                    margin-bottom: 40px;
                    font-size: 36px;
                }
                .value-cards {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    flex-wrap: wrap;
                }
                .value-card {
                    width: 30%;
                    background-color: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .value-proposition h3 {
                    margin-bottom: 15px;
                    font-size: 24px;
                    color: #3b82f6;
                }
                .value-proposition p {
                    color: #555;
                }

                /* Features Section */
                .features {
                    padding: 80px 20px;
                    background-color: #f3f4f6;
                }
                .features h2 {
                    text-align: center;
                    margin-bottom: 40px;
                    font-size: 36px;
                }
                .features-list {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    flex-wrap: wrap;
                }
                .feature {
                    width: 30%;
                    background-color: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .feature h3 {
                    margin-bottom: 15px;
                    font-size: 24px;
                    color: #3b82f6;
                }
                .feature p {
                    color: #555;
                }

                /* Call to Action Section */
                .cta {
                    padding: 80px 20px;
                    text-align: center;
                }
                .cta h2 {
                    font-size: 36px;
                    margin-bottom: 20px;
                }
                .cta-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                }

                /* Responsiveness */
                @media (max-width: 768px) {
                    .value-cards, .features-list {
                        flex-direction: column;
                        width: 100%;
                    }
                    .value-card, .feature {
                        width: 100%;
                        margin-bottom: 20px;
                    }
                }
                `}
            </style>

            {/* Header Section */}
            <header>
                <div className="logo">Vorifi</div>
                <div className="auth-buttons">
                    <a href="/sign-up?redirect_url=https%3A%2F%2Fvorifi.vercel.app%2F" className="button">Sign Up</a>
                    <a href="/sign-in?redirect_url=https%3A%2F%2Fvorifi.vercel.app%2F" className="button">Login</a>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <h1>Empower Your Financial Future with Vorifi</h1>
                <p>Manage Your Wealth Smarter with Expert Guidance and AI-Powered Insights. Make Confident Decisions for Your Financial Journey.</p>
                <div className="cta-buttons">
                    <a href="/sign-up?redirect_url=https%3A%2F%2Fvorifi.vercel.app%2F">
                        <button className="cta-signup">Sign Up Now</button>
                    </a>
                    <a href="/sign-in?redirect_url=https%3A%2F%2Fvorifi.vercel.app%2F">
                        <button className="cta-signup">Login</button>
                    </a>
                </div>
            </section>

            {/* Value Proposition Section */}
            <section className="value-proposition">
                <h2>Why Choose Vorifi?</h2>
                <div className="value-cards">
                    <div className="value-card">
                        <h3>AI-Powered Financial Insights</h3>
                        <p>Personalized advice at your fingertips.</p>
                    </div>
                    <div className="value-card">
                        <h3>Expert Management</h3>
                        <p>Manage all your finances through one system.</p>
                    </div>
                    <div className="value-card">
                        <h3>Secure and Transparent</h3>
                        <p>Your financial safety is our priority.</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Features Designed for Your Financial Success</h2>
                <div className="features-list">
                    <div className="feature">
                        <h3>Real-Time Financial Monitoring</h3>
                        <p>Stay updated with live data.</p>
                    </div>
                    <div className="feature">
                        <h3>Fully Customizable</h3>
                        <p>Manage finances your way.</p>
                    </div>
                    <div className="feature">
                        <h3>Seamless Integration</h3>
                        <p>Connect all financial accounts effortlessly.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta">
                <h2>Ready to Transform Your Financial Future?</h2>
                <div className="cta-buttons">
                    <a href="/sign-up?redirect_url=https%3A%2F%2Fvorifi.vercel.app%2F">
                        <button className="cta-signup">Sign Up Now</button>
                    </a>
                </div>
            </section>
        </>
    );
};