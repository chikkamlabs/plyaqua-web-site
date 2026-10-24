import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'PlyAqua - More Water More Fun',
  description: 'Pure packaged drinking water for every occasion.',
  openGraph: {
    title: 'PlyAqua - More Water More Fun',
    description: 'Pure packaged drinking water for every occasion.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlyAqua - More Water More Fun',
    description: 'Pure packaged drinking water for every occasion.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
