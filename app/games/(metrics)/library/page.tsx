import { Suspense } from 'react';

import { GamesFilter } from '@ts/games/filter';

import GamesLibrary from './components/GamesLibrary';
import GamesLibrarySkeleton from './components/GamesLibrarySkeleton';

/**
 * @param props
 * @param props.searchParams - Search params to filter games by.
 * @returns Page with all user's games table and search.
 */
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
