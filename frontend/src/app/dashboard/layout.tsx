import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | Aegis Vault',
    description: 'Monitor your Aegis Vault portfolio, performance, and asset distribution in real-time.',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
