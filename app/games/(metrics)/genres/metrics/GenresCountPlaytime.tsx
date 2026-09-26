'use client';

import Game from '@ts/games/game';
import { CoreMetricProps } from '@ts/games/metric';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import GenresCount from './GenresCount';
import GenresPlaytime from './GenresPlaytime';

/**
 * @param props
 * @param props.games - Games of user.
 * @param props.userId - User whose metrics will be fetched.
 * @returns Metric of top genres by games count and playtime as 2 submetrics.
 */
export default function GenresCountPlaytime({
  games,
  userId
}: CoreMetricProps) {
  const series = games.mapByKey<Game['series'], 'id'>(
    (game) => game.series,
    'id'
  );

  const genres = games.flatMapByKey<Game['genres'][number], 'id'>(
    (game) => game.genres,
    'id'
  );

  return (
    <MetricWrapper id='genres-count-playtime'>
      <div className='double-doughnut'>
        <GenresCount genres={genres} seriesArray={series} userId={userId} />
        <GenresPlaytime genres={genres} userId={userId} />
      </div>
    </MetricWrapper>
  );
}
