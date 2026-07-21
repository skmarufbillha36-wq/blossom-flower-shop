import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Blossom — Premium Flower Shop',
    template: '%s | Blossom Flower Shop',
  },
  description:
    'Discover our handcrafted floral arrangements. Fresh flowers, custom bouquets, and same-day delivery available.',
  keywords: ['flower shop', 'bouquets', 'floral arrangements', 'same-day delivery', 'fresh flowers'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Blossom Flower Shop',
    title: 'Blossom — Premium Flower Shop',
    description: 'Handcrafted floral arrangements & custom bouquets with same-day delivery.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
