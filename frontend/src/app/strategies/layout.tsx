import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Strategies | Aegis Vault',
    description: 'Discover and deploy automated yield strategies for your Bitcoin DeFi assets. Multi-vault optimization and risk-adjusted returns.',
};

export default function StrategiesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
