'use client';

import { usePathname } from 'next/navigation';

import { ModulesPaths } from '@lib/utils';

export default function PageName() {
  const pathname = usePathname();
  return <h2>{ModulesPaths[pathname]?.label}</h2>;
}
