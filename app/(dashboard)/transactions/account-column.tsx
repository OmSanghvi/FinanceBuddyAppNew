import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

type Props = {
    account: string;
    accountId: string;
}

/**
 * Component for rendering an account column.
 *
 * This component displays the account name and handles the click event to open the account details.
 *
 * @param {Props} props - The component props.
 * @param {string} props.account - The name of the account.
 * @param {string} props.accountId - The ID of the account.
 * @returns {JSX.Element} The rendered account column component.
 */
export const AccountColumn = ({
                                  account,
                                  accountId
                              }: Props) => {
    const { onOpen: onOpenAccount } = useOpenAccount();

    /**
     * Handles the click event to open the account details.
     */
    const onClick = () => {
        onOpenAccount(accountId);
    }

    return (
        <div onClick={onClick} className="flex items-center cursor-pointer hover:underline">
            {account}
        </div>
    )
}