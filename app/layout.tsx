import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OTB Feed',
  description: 'Customized feed of OTB chess results',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
