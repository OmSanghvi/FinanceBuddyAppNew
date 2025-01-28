"use client"
import qs from "query-string";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

/**
 * Component for rendering the Account Filter.
 *
 * This component displays a dropdown for selecting an account, which updates the URL query parameters based on the selected account.
 * It fetches the list of accounts and summary data, and disables the dropdown while loading.
 *
 * @returns {JSX.Element} The rendered Account Filter component.
 */
export const AccountFilter = () => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const accountId = params.get("accountId") || "all";
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts();
    const { isLoading: isLoadingSummary } = useGetSummary();

    /**
     * Handles the change event for the account selection.
     *
     * @param {string} newValue - The new account ID value.
     */
    const onChange = (newValue: string) => {
        const query = {
            accountId: newValue,
            from,
            to,
        };

        if (newValue === "all") {
            query.accountId = "";
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query,
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return (
        <Select value={accountId} onValueChange={onChange} disabled={isLoadingAccounts || isLoadingSummary}>
            <SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20
            hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
                <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">
                    All accounts
                </SelectItem>
                {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};