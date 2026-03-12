import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Transaction History | Aegis Vault',
    description: 'Monitor your protocol interactions and transaction history on Aegis Vault.',
};

export default function HistoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
