import { IBM_Plex_Mono, Inter } from 'next/font/google';

export const mainFont = IBM_Plex_Mono({
  variable: '--font-ibm-plex',
  style: 'normal',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic']
});

export const secondaryFont = Inter({
  variable: '--font-inter',
  style: 'normal',
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic']
});
