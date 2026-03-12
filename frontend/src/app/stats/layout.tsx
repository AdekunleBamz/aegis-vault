import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Protocol Stats | Aegis Vault',
    description: 'Real-time protocol statistics for Aegis Vault. Monitor TVL, rewards, and staking activity.',
};

export default function StatsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
