import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Withdraw Assets | Aegis Vault',
    description: 'Withdraw your assets from Aegis Vault. Secure and non-custodial asset management.',
};

export default function WithdrawLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
