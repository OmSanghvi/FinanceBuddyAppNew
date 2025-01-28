"use-client";

/**
 * WelcomeMsg component for displaying a welcome message.
 *
 * This component renders a welcome message with a heading and a paragraph.
 * It is styled with Tailwind CSS classes.
 *
 * @returns {JSX.Element} The rendered WelcomeMsg component.
 */
export const WelcomeMsg = () => {
    return (
        <div className="space-y-2 mb-4">
            <h2 className="text-2xl lg:text-4xl text-white font-medium">
                Welcome Back 👋
            </h2>
            <p className="text-sm lg:text-base text-[#89b6fd]">
                This is your Financial Overview Report
            </p>
        </div>
    );
};