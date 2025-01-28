import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

/**
 * Props for the NavButton component.
 *
 * @typedef {Object} Props
 * @property {string} href - The URL to navigate to when the button is clicked.
 * @property {string} label - The text label to display on the button.
 * @property {boolean} [isActive] - Indicates if the button is in an active state.
 */
type Props = {
    href: string;
    label: string;
    isActive?: boolean;
};

/**
 * NavButton component for rendering a navigation button with a link.
 *
 * This component renders a button that navigates to a specified URL when clicked.
 * It supports an active state to indicate the current page.
 *
 * @param {Props} props - The properties for the NavButton component.
 * @returns {JSX.Element} The rendered NavButton component.
 */
export const NavButton = ({ href, label, isActive }: Props) => {
    return (
        <Button
            asChild
            size="sm"
            variant="outline"
            className={cn(
                "w-full lg:w-auto justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition",
                isActive ? "bg-white/10 text-white" : "bg-transparent"
            )}
        >
            <Link href={href}>
                {label}
            </Link>
        </Button>
    );
};