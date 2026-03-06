import { Suspense } from 'react';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';

import GenresCount from './GenresCount';

export default function GamesMainPage() {
  // return (
  //   <>
  //     <Link href='/games/genres'>Genres</Link>
  //     <Link href='/games/studios'>Developers & Publishers</Link>
  //     <Link href='/games/platforms'>Platforms</Link>
  //     <Link href='/games/titles'>Video Games</Link>
  //     <Link href='/games/library'>Library</Link>
  //   </>
  // );

  return (
    <Suspense
      fallback={<ChartSkeleton type='doughnut' className='test-chart' />}
    >
      <GenresCount />
    </Suspense>
  );
}
