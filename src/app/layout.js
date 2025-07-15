// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "My Next.js App",
  description: "A Studios website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
