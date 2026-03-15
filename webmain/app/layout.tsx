import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { GeistPixelGrid } from 'geist/font/pixel'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Disco — Privacy-Preserving Events with Zero-Knowledge Proofs',
  description:
    'Prove you meet event requirements without revealing personal data. Disco uses ZK proofs and BitGo wallets on Base so you can RSVP and attend events privately. No emails, no exposed wallet history.',
  keywords: [
    'privacy-preserving events',
    'zero-knowledge proofs',
    'ZK proofs events',
    'private event RSVP',
    'Web3 events',
    'BitGo wallet',
    'Base blockchain',
    'event verification',
    'proof of eligibility',
    'private attendance',
  ],
  authors: [{ name: 'Disco' }],
  creator: 'Disco',
  publisher: 'Disco',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Disco — Privacy-Preserving Events with Zero-Knowledge Proofs',
    description:
      'Prove eligibility for events without revealing personal or on-chain data. ZK proofs, BitGo wallets, Base smart contracts.',
    siteName: 'Disco',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Disco — Privacy-Preserving Events',
    description:
      'Prove you meet event requirements with ZK proofs. No emails, no exposed wallet history. Built on Base with BitGo.',
    creator: '@disco',
  },
  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: '#F2F1EA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${GeistPixelGrid.variable}`} suppressHydrationWarning>
      <body className="font-mono antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
