import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Security | Aegis Vault',
    description: 'Your security is our priority. Learn about Aegis Vault audits, bug bounties, and safe practices for Bitcoin DeFi.',
};

export default function SecurityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
