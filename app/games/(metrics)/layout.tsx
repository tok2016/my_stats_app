import { Plus } from '@mynaui/icons-react';

import Link from 'next/link';

import Button from '@components/Button';
import PageName from '@components/profile-layout/PageName';

export default function GamesMetricLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className='games-page-name'>
        <PageName />
        <Link href='/add-game'>
          <Button variant='secondary' beforeIcon={<Plus />}>
            Add Game
          </Button>
        </Link>
      </div>

      <div className='metrics'>{children}</div>
    </>
  );
}
