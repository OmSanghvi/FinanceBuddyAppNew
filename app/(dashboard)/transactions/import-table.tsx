import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableHeadSelect } from "./table-head-select";

type Props = {
    headers: string[];
    body: string[][];
    selectedColumns: Record<string, string | null>;
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
}

/**
 * Component for rendering the import table.
 *
 * This component displays a table with selectable headers and data rows for importing transactions.
 *
 * @param {Props} props - The component props.
 * @param {string[]} props.headers - The headers of the table.
 * @param {string[][]} props.body - The body of the table containing rows of data.
 * @param {Record<string, string | null>} props.selectedColumns - The selected columns mapping.
 * @param {(columnIndex: number, value: string | null) => void} props.onTableHeadSelectChange - The function to call when a table head select changes.
 * @returns {JSX.Element} The rendered import table component.
 */
export const ImportTable = ({ headers, body, selectedColumns, onTableHeadSelectChange }: Props) => {
    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                        {headers.map((_item, index) => (
                            <TableHead key={index}>
                                <TableHeadSelect columnIndex={index} selectedColumns={selectedColumns} onChange={onTableHeadSelectChange} />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body.map((row: string[], index) => (
                        <TableRow key={index}>
                            {row.map((cell, index) => (
                                <TableCell key={index}>
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}