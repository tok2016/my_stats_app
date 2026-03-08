import { Suspense } from 'react';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';

import GenresCount from '@app/games/test/doughnut/GenresCount';

export default function DoughnutPage() {
  return (
    <Suspense
      fallback={<ChartSkeleton type='doughnut' className='test-chart' />}
    >
      <GenresCount />
    </Suspense>
  );
}
