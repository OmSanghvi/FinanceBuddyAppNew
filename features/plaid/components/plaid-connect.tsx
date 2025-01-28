"use client";

import { useState } from "react";
import { useMount } from "react-use";
import { usePlaidLink } from "react-plaid-link";

import { Button } from "@/components/ui/button";
import { useCreateLinkToken } from "@/features/plaid/api/use-create-link-token";
import { useExchangePublicToken } from "@/features/plaid/api/use-exchange-public-token";

/**
 * Component for connecting to Plaid.
 * It handles the creation of a link token, exchanges the public token, and opens the Plaid Link interface.
 *
 * @returns {JSX.Element} The rendered PlaidConnect component.
 */
export const PlaidConnect = () => {
    // State to store the link token
    const [token, setToken] = useState<string | null>(null);

    // Hook to create a link token
    const createLinkToken = useCreateLinkToken();
    // Hook to exchange the public token
    const exchangePublicToken = useExchangePublicToken();

    // Effect to create a link token on mount
    useMount(() => {
        createLinkToken.mutate(undefined, {
            onSuccess: ({ data }) => {
                setToken(data);
            },
        });
    });

    // Hook to initialize Plaid Link
    const plaid = usePlaidLink({
        token: token,
        onSuccess: (publicToken) => {
            exchangePublicToken.mutate({
                publicToken,
            });
        },
        env: "sandbox",
    });

    /**
     * Handles the button click to open Plaid Link.
     */
    const onClick = () => {
        plaid.open();
    };

    // Determine if the button should be disabled
    const isDisabled =
        !plaid.ready ||
        exchangePublicToken.isPending;

    return (
        <Button
            onClick={onClick}
            disabled={isDisabled}
            size="sm"
            variant="ghost"
        >
            Connect
        </Button>
    );
};