import { Suspense } from 'react';

import Game from '@ts/games/game';
import { MetricContentProps } from '@ts/games/metric';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import Submetric from '@components/data-blocks/Submetric';

import GenresCount from './GenresCount';
import GenresPlaytime from './GenresPlaytime';

export default function GenresCountPlaytime({
  metricId,
  games,
  userId
}: MetricContentProps) {
  const series = games.mapByKey<Game['series'], 'id'>(
    (game) => game.series,
    'id'
  );

  const genres = games.flatMapByKey<Game['genres'][number], 'id'>(
    (game) => game.genres,
    'id'
  );

  return (
    <MetricWrapper id={metricId}>
      <div className='double-doughnut'>
        <Submetric id='genres-count'>
          <Suspense
            fallback={
              <ChartSkeleton type='doughnut' className='switchable-chart' />
            }
          >
            <GenresCount genres={genres} seriesArray={series} userId={userId} />
          </Suspense>
        </Submetric>

        <Submetric id='genres-playtime'>
          <Suspense
            fallback={
              <ChartSkeleton type='doughnut' className='switchable-chart' />
            }
          >
            <GenresPlaytime genres={genres} userId={userId} />
          </Suspense>
        </Submetric>
      </div>
    </MetricWrapper>
  );
}
