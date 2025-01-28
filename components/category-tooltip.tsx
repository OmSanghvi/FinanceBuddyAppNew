import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

/**
 * Component for rendering a tooltip for category data.
 *
 * This component displays a tooltip with category name and formatted expense value.
 *
 * @param {Object} props - The properties for the CategoryTooltip component.
 * @param {boolean} props.active - Whether the tooltip is active.
 * @param {Array} props.payload - The payload data for the tooltip.
 * @returns {JSX.Element | null} The rendered CategoryTooltip component or null if not active.
 */
export const CategoryTooltip = ({ active, payload }: any) => {
    if (!active) return null;
    const name = payload[0].payload.name;
    const value = payload[0].value;

    return (
        <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
            <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
                {name}
            </div>
            <Separator />
            <div className="p-2 px-3 space-y-1">
                <div className="flex items-center justify-between gap-x-4">
                    <div className="flex items-center gap-x-2">
                        <div className="size-1.5 bg-rose-500 rounded-full" />
                        <p className="text-sm text-muted-foreground">
                            Expenses
                        </p>
                    </div>
                    <p className="text-sm text-right font-medium">
                        {formatCurrency(value * -1)}
                    </p>
                </div>
            </div>
        </div>
    );
};