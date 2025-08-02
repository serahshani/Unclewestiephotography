// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: 'Uncle Westiee Studios – Kenya Photography & Videography',
  description: 'Capture your beautiful memories with Uncle Westiee Studios – your trusted photography and videography partner in Kenya.',
  keywords: 'Uncle Westiee Studios, Photography Kenya, Wedding Videographer, Best Photographer in Kenya, Event Coverage Kenya',
  openGraph: {
    title: 'Uncle Westiee Studios – Photography & Videography',
    description: 'Get high-quality photos and videos for weddings, events, and more in Kenya.',
    url: 'https://unclewestieestudios.co.ke',
    siteName: 'Uncle Westiee Studios',
    images: [
      {
        url: '/Westieelogo.png',  // Make sure this image exists in the /public folder
        width: 1200,
        height: 630,
        alt: 'Logo of Uncle Westiee Studios', // ✅ simplified and clear
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/Westieelogo.png',  // Favicon or logo
  },
  other: {
    'application-name': 'Uncle Westiee Studios',
    'og:site_name': 'Uncle Westiee Studios', // ✅ helps Google identify proper name
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
