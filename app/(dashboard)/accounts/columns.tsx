"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { client } from "@/lib/hono";
import { Actions } from "./actions";

export type ResponseType = InferResponseType<typeof client.api.accounts.$get, 200>["data"][0];

/**
 * Column definitions for the accounts table.
 *
 * This array defines the columns for the accounts table, including selection checkboxes,
 * account name with sorting functionality, and action buttons for each row.
 */
export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    /**
     * Header component for the select column.
     *
     * @param {object} table - The table instance.
     * @returns {JSX.Element} The rendered header component.
     */
    header: ({ table }) => (
        <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
        />
    ),
    /**
     * Cell component for the select column.
     *
     * @param {object} row - The row instance.
     * @returns {JSX.Element} The rendered cell component.
     */
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    /**
     * Header component for the name column.
     *
     * @param {object} column - The column instance.
     * @returns {JSX.Element} The rendered header component.
     */
    header: ({ column }) => {
      return (
          <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
      )
    },
  },
  {
    id: "actions",
    /**
     * Cell component for the actions column.
     *
     * @param {object} row - The row instance.
     * @returns {JSX.Element} The rendered cell component.
     */
    cell: ({ row }) => <Actions id={row.original.id} />
  }
]