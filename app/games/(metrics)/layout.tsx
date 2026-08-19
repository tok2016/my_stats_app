import { Plus } from '@mynaui/icons-react';

import Link from 'next/link';

import { refreshSteamData } from '@lib/server-actions';

import Button from '@components/Button';
import PageName from '@components/profile-layout/PageName';

import './games-metrics.scss';

export default async function GamesMetricLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  await refreshSteamData();

  return (
    <>
      <div className='games-page-name'>
        <PageName />
        <Link href='/games/add-game'>
          <Button variant='secondary' beforeIcon={<Plus />}>
            Add Game
          </Button>
        </Link>
      </div>

      <div className='metrics'>{children}</div>
    </>
  );
}
