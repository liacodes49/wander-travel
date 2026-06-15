import type { Metadata } from 'next';
import { Poppins, Playfair_Display, Dancing_Script } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const playfair = Playfair_Display({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dancing = Dancing_Script({
  weight: ['600'],
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wander The World — AI Travel Planner',
  description: 'Describe your dream trip and let AI craft the perfect day-by-day itinerary, budget breakdown, local food guides, hidden gems, and custom packing checklists.',
  keywords: ['travel planner', 'AI travel', 'itinerary generator', 'travel budget', 'explore the world'],
  authors: [{ name: 'Wander' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} ${dancing.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
