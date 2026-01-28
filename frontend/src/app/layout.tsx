import '../styles/globals.css'

export const metadata = {
  title: 'Aegis Vault',
  description: 'Stake STX and earn AGS rewards'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
