'use client';

import Game from '@ts/games/game';
import { CoreMetricProps } from '@ts/games/metric';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import PlatformsCount from './PlatformsCount';
import PlatformsPlaytime from './PlatformsPlaytime';

/**
 * @param props
 * @param props.games - Games of user.
 * @param props.userId - User whose metrics will be fetched.
 * @returns Metric of top platforms by games count and playtime as 2 submetrics.
 */
export default function PlatformsCountPlaytime({
  games,
  userId
}: CoreMetricProps) {
  const series = games.mapByKey<Game['series'], 'id'>(
    (game) => game.series,
    'id'
  );
  const platforms = games.mapByKey<Game['platform'], 'id'>(
    (game) => game.platform,
    'id'
  );

  return (
    <MetricWrapper id='platforms-count-playtime'>
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
