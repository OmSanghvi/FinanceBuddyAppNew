import { AccountFilter } from "./account-filter";
import { DateFilter } from "./date-filter";

/**
 * Filters component for displaying account and date filters.
 *
 * This component renders a flex container with AccountFilter and DateFilter components.
 * It adjusts the layout based on the screen size.
 *
 * @returns {JSX.Element} The rendered Filters component.
 */
export const Filters = () => {
    return (
        <div className="flex flex-col lg:flex-row items-center gap-y-2 lg:gap-y-0 lg:gap-x-2">
            <AccountFilter/>
            <DateFilter/>
        </div>
    );
}