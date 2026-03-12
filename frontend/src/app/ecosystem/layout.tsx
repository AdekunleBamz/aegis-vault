import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ecosystem | Aegis Vault',
    description: 'Explore the Aegis Vault ecosystem. Discover partner protocols, community tools, and the future of Bitcoin DeFi.',
};

export default function EcosystemLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
