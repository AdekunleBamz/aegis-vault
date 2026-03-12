import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Claim Rewards | Aegis Vault',
    description: 'Claim your accumulated AGS rewards and vault yields on Aegis Vault.',
};

export default function ClaimLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
