"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts";
import Chat from "@/components/chat";
import LoadingPage from "@/components/LoadingPage";

/**
 * Component for rendering the accounts page.
 *
 * This component fetches and displays a list of accounts, with options to add new accounts and delete existing ones.
 *
 * @returns {JSX.Element} The rendered accounts page component.
 */
const AccountsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const newAccount = useNewAccount();
    const accountsQuery = useGetAccounts();
    const deleteAccounts = useBulkDeleteAccounts();
    const accounts = accountsQuery.data || [];

    const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

    useEffect(() => {
        if (!accountsQuery.isLoading && !deleteAccounts.isPending) {
            setIsLoading(false);
        }
    }, [accountsQuery.isLoading, deleteAccounts.isPending]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Accounts page
                    </CardTitle>
                    <Button onClick={newAccount.onOpen} size="sm">
                        <Plus className="size-4 mr-2" />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        filterKey="name"
                        columns={columns}
                        data={accounts}
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteAccounts.mutate({ ids });
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
            <Chat />
        </div>
    );
}

export default AccountsPage;