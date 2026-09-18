'use client';

import { usePathname } from 'next/navigation';

import { ModulesPathsAndNames } from '@lib/utils';

export default function PageName() {
  const pathname = usePathname();
  return <h2>{ModulesPathsAndNames[pathname]?.label}</h2>;
}
