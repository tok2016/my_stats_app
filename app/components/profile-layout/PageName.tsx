'use client';

import { usePathname } from 'next/navigation';

import { ModulesPathsAndNames } from '@lib/utils';

/**
 * @returns Renders page name by its path.
 */
export default function PageName() {
  const pathname = usePathname();
  return <h2 className='page-name'>{ModulesPathsAndNames[pathname]?.label}</h2>;
}
