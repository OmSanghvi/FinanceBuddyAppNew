import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";

type Props = {
    id: string;
    category: string | null;
    categoryId: string | null;
}

/**
 * Component for rendering a category column.
 *
 * This component displays the category name and handles the click event to open the category or transaction details.
 *
 * @param {Props} props - The component props.
 * @param {string} props.id - The ID of the transaction.
 * @param {string | null} props.category - The name of the category.
 * @param {string | null} props.categoryId - The ID of the category.
 * @returns {JSX.Element} The rendered category column component.
 */
export const CategoryColumn = ({
                                   id,
                                   category,
                                   categoryId
                               }: Props) => {
    const { onOpen: onOpenCategory } = useOpenCategory();
    const { onOpen: onOpenTransaction } = useOpenTransaction();

    /**
     * Handles the click event to open the category or transaction details.
     */
    const onClick = () => {
        if (categoryId) {
            onOpenCategory(categoryId);
        } else {
            onOpenTransaction(id);
        }
    }

    return (
        <div onClick={onClick} className={cn("flex items-center cursor-pointer hover:underline",
            !category && "text-rose-500"
        )}>
            {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
            {category || "Uncategorized"}
        </div>
    )
}