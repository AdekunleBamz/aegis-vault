import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Staking Tiers | Aegis Vault',
    description: 'Unlock premium benefits and higher yield with Aegis Vault staking tiers. From Alpha to Omega, find the tier that fits your strategy.',
};

export default function TiersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
