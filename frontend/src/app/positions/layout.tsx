import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Staking Positions | Aegis Vault',
    description: 'Manage your active vault positions and monitor yield accrual on Aegis Vault.',
};

export default function PositionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
