import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "All You Can Ask Buffet - Warren Buffett AI Chat",
  description: "Interactive chat interface with a virtual Warren Buffett AI. Get investing wisdom, business insights, and learn from the Oracle of Omaha's characteristic communication style and decision-making frameworks.",
  keywords: "Warren Buffett, investing, AI chat, business wisdom, value investing, Oracle of Omaha, investment advice, financial education",
  author: "All You Can Ask Buffet",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  // Comprehensive favicon and icon configuration
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon/safari-pinned-tab.svg', color: '#4a5568' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  themeColor: '#4a5568',
  openGraph: {
    title: "All You Can Ask Buffet - Warren Buffett AI Chat",
    description: "Interactive chat interface with a virtual Warren Buffett AI. Get investing wisdom, business insights, and learn from the Oracle of Omaha's characteristic communication style.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/buffet.png',
        width: 1200,
        height: 630,
        alt: 'All You Can Ask Buffet - Warren Buffett AI Chat',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All You Can Ask Buffet - Warren Buffett AI Chat",
    description: "Interactive chat interface with a virtual Warren Buffett AI. Get investing wisdom and business insights from the Oracle of Omaha.",
    images: ['/buffet.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
