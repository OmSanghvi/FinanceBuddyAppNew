import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
    columnIndex: number;
    selectedColumns: Record<string, string | null>;
    onChange: (columnIndex: number, value: string | null) => void;
};

const options = ["amount", "payee", "date"];

/**
 * Component for rendering a select dropdown in the table header.
 *
 * This component allows selecting a column for mapping during the import process.
 *
 * @param {Props} props - The component props.
 * @param {number} props.columnIndex - The index of the column.
 * @param {Record<string, string | null>} props.selectedColumns - The selected columns mapping.
 * @param {(columnIndex: number, value: string | null) => void} props.onChange - The function to call when a select value changes.
 * @returns {JSX.Element} The rendered select dropdown component.
 */
export const TableHeadSelect = ({ columnIndex, selectedColumns, onChange }: Props) => {
    const currentSelection = selectedColumns[`column_${columnIndex}`];
    return (
        <Select value={currentSelection || ""} onValueChange={(value) => onChange(columnIndex, value)}>
            <SelectTrigger className={cn("focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",
                currentSelection && "text-blue-500"
            )}>
                <SelectValue placeholder="Skip" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="skip">Skip</SelectItem>
                {options.map((option, index) => {
                    const disabled = Object.values(selectedColumns).includes(option) && selectedColumns[`column_${columnIndex}`] !== option;
                    return (
                        <SelectItem key={index} value={option} disabled={disabled} className="capitalize">
                            {option}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
};