import { Suspense } from 'react';

import { GamesFilter } from '@ts/games/filter';

import GamesLibrary from './components/GamesLibrary';
import GamesLibrarySkeleton from './components/GamesLibrarySkeleton';

export default async function GameLibraryPage({
  searchParams
}: {
  searchParams: Promise<GamesFilter>;
}) {
  const awaitedParams = await searchParams;

  return (
    <div className='library'>
      <Suspense fallback={<GamesLibrarySkeleton />}>
        <GamesLibrary filters={awaitedParams} />
      </Suspense>
    </div>
  );
}
