"use client";

import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { PlaidConnect } from "@/features/plaid/components/plaid-connect";
import { useGetConnectedBank } from "@/features/plaid/api/use-get-connected-bank";
import { PlaidDisconnect } from "@/features/plaid/components/plaid-disconnect";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

/**
 * Component for rendering the settings card.
 *
 * This component displays the settings card with information about the connected bank account.
 * It shows a loading state while fetching the connected bank account data.
 *
 * @returns {JSX.Element} The rendered settings card component.
 */
export const SettingsCard = () => {
    const {
        data: connectedBank,
        isLoading: isLoadingConnectedBank
    } = useGetConnectedBank();

    if (isLoadingConnectedBank) {
        return (
            <Card className="border-none drop-shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl line-clamp-1">
                        <Skeleton className="h-6 w-24" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full flex items-center justify-center">
                        <Loader2 className="size-6 text-slate-300 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl line-clamp-1">
                    Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Separator />
                <div className="flex flex-col gap-y-2 lg:flex-row items-center py-4">
                    <p className="text-sm font-medium w-full lg:w-[16.5rem]">
                        Bank Account
                    </p>
                    <div className="w-full flex items-center justify-between">
                        <div className={cn(
                            "text-sm truncate flex items-center",
                            !connectedBank && "text-muted-foreground"
                        )}>
                            {connectedBank
                                ? "Bank account connected"
                                : "No bank account connected"
                            }

                        </div>
                        {connectedBank
                            ? <PlaidDisconnect />
                            : <PlaidConnect />
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};