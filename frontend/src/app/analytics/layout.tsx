import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Analytics | Aegis Vault',
    description: 'Institutional-grade analytics for the Aegis Vault protocol. Track TVL, yield rates, and protocol growth in real-time.',
};

export default function AnalyticsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
