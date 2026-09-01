import { Suspense } from 'react';

import Game from '@ts/games/game';
import { MetricContentProps } from '@ts/games/metric';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import Submetric from '@components/data-blocks/Submetric';

import PlatformsCount from './PlatformsCount';
import PlatformsPlaytime from './PlatformsPlaytime';

export default function PlatformsCountPlaytime({
  metricId,
  games
}: MetricContentProps) {
  const series = games.mapByKey<Game['series'], 'id'>(
    (game) => game.series,
    'id'
  );
  const platforms = games.mapByKey<Game['platform'], 'id'>(
    (game) => game.platform,
    'id'
  );

  return (
    <MetricWrapper id={metricId}>
      <div className='double-doughnut'>
        <Suspense
          fallback={
            <ChartSkeleton type='doughnut' className='switchable-chart' />
          }
        >
          <Submetric id='platforms-count'>
            <PlatformsCount platforms={platforms} seriesArray={series} />
          </Submetric>
        </Suspense>

        <Suspense
          fallback={
            <ChartSkeleton type='doughnut' className='switchable-chart' />
          }
        >
          <Submetric id='platforms-playtime'>
            <PlatformsPlaytime platforms={platforms} />
          </Submetric>
        </Suspense>
      </div>
    </MetricWrapper>
  );
}
