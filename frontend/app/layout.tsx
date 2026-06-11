import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tristan Engine',
  description: 'Document compliance and risk-screening engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
