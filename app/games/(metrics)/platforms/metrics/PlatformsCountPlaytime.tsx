'use client';

import Game from '@ts/games/game';
import { MetricContentProps } from '@ts/games/metric';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

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
        <PlatformsCount
          platforms={platforms}
          seriesArray={series}
          userId={userId}
        />

        <PlatformsPlaytime platforms={platforms} userId={userId} />
      </div>
    </MetricWrapper>
  );
}
