'use client';

import Game from '@ts/games/game';
import { MetricContentProps } from '@ts/games/metric';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

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
        <GenresCount genres={genres} seriesArray={series} userId={userId} />
        <GenresPlaytime genres={genres} userId={userId} />
      </div>
    </MetricWrapper>
  );
}
