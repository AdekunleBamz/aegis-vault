import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Governance | Aegis Vault',
    description: 'Participate in the Aegis Vault DAO. Vote on proposals, submit new ideas, and help shape the future of Bitcoin DeFi yield optimization.',
};

export default function GovernanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
