import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { SelectSingleEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

/**
 * Props for the DatePicker component.
 *
 * @typedef {Object} Props
 * @property {Date} [value] - The selected date.
 * @property {SelectSingleEventHandler} [onChange] - The event handler for date selection.
 * @property {boolean} [disabled] - Whether the date picker is disabled.
 */
type Props = {
    value?: Date;
    onChange?: SelectSingleEventHandler;
    disabled?: boolean;
}

/**
 * DatePicker component for selecting a single date.
 *
 * This component renders a button that triggers a popover containing a calendar.
 * Users can select a date from the calendar, and the selected date is displayed on the button.
 *
 * @param {Props} props - The properties for the DatePicker component.
 * @returns {JSX.Element} The rendered DatePicker component.
 */
export const DatePicker = ({
                               value,
                               onChange,
                               disabled
                           }: Props) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button disabled={disabled} variant="outline" className={cn("w-full justify-start text-left", !value && "text-muted-foreground")}>
                    <CalendarIcon className="size-4 mr-2" />
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Calendar mode="single" selected={value} onSelect={onChange} disabled={disabled} initialFocus />
            </PopoverContent>
        </Popover>
    )
}