import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Stake | Aegis Vault',
    description: 'Stake your STX tokens and earn AGS rewards with Aegis Vault. Secure, non-custodial, and optimized for maximum yield.',
};

export default function StakeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
