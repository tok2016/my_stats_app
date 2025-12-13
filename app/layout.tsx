import type { Metadata } from 'next';

import { mainFont, secondaryFont } from '@lib/fonts';

import '@styles/global.scss';
import '@styles/modules.scss';
import '@styles/statuses.scss';

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
      <body className={`${mainFont.variable} ${secondaryFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
