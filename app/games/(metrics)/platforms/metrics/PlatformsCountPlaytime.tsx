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
  games,
  userId
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
        <Submetric id='platforms-count'>
          <Suspense
            fallback={
              <ChartSkeleton type='doughnut' className='switchable-chart' />
            }
          >
            <PlatformsCount
              platforms={platforms}
              seriesArray={series}
              userId={userId}
            />
          </Suspense>
        </Submetric>

        <Submetric id='platforms-playtime'>
          <Suspense
            fallback={
              <ChartSkeleton type='doughnut' className='switchable-chart' />
            }
          >
            <PlatformsPlaytime platforms={platforms} userId={userId} />
          </Suspense>
        </Submetric>
      </div>
    </MetricWrapper>
  );
}
