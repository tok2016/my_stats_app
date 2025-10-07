import type { Metadata } from 'next';

import { secondaryFont } from '@lib/fonts';

import '@styles/global.scss';

export const metadata: Metadata = {
  title: 'My_Stats',
  description: 'Your interests stats and evolution'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${secondaryFont.variable}`}>{children}</body>
    </html>
  );
}
