'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNewStock } from '@/features/stocks/hooks/use-new-stock';
import { Plus } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { useGetStocks } from '@/features/stocks/api/use-get-stocks';
import { Skeleton } from '@/components/ui/skeleton';
import { useBulkDeleteStocks } from '@/features/stocks/api/use-bulk-delete-stocks';
import Chat from '@/components/chat';
import LoadingPage from '@/components/LoadingPage';

const StocksPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const newStock = useNewStock();
    const stocksQuery = useGetStocks();
    const deleteStocks = useBulkDeleteStocks();
    const stocks = stocksQuery.data || [];

    const isDisabled = stocksQuery.isLoading || deleteStocks.isLoading;

    useEffect(() => {
        if (!stocksQuery.isLoading && !deleteStocks.isLoading) {
            setIsLoading(false);
        }
    }, [stocksQuery.isLoading, deleteStocks.isLoading]);

    if (isLoading) {
        return <LoadingPage />;
    }
    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Stocks page
                    </CardTitle>
                    <Button onClick={newStock.onOpen} size="sm">
                        <Plus className="size-4 mr-2" />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        filterKey="name"
                        columns={columns}
                        data={stocks}
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteStocks.mutate({ ids });
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
            <Chat />
        </div>
    );
}
export default StocksPage;