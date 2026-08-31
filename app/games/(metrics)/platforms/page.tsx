import { Suspense } from 'react';

import Game from '@ts/games/game';

import { getGames } from '@lib/server-actions';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import HighestRatedPlatforms from './metrics/HighestRatedPlatforms';
import PlatformsCount from './metrics/PlatformsCount';
import PlatformsPeriodTops from './metrics/PlatformsPertiodTops';
import PlatformsPlaytime from './metrics/PlatformsPlaytime';
import HighestRatedPlatformsSkeleton from './skeletons/HighestRatedPlatformsSkeleton';

export default async function GamesPlatformsPage() {
  const games = await getGames();
  const platformsMap = games.mapByKey<Game['platform'], 'id'>(
    (game) => game.platform,
    'id'
  );
  const seriesMap = games.mapByKey<Game['series'], 'id'>(
    (game) => game.series,
    'id'
  );
  const genresMap = games.flatMapByKey<Game['genres'][number], 'id'>(
    (game) => game.genres,
    'id'
  );

  return (
    <>
      <div className='double-doughnut'>
        <MetricWrapper id='platforms-count' title='Your biggest platforms'>
          <Suspense
            fallback={
              <ChartSkeleton type='doughnut' className='switchable-chart' />
            }
          >
            <PlatformsCount platforms={platformsMap} seriesArray={seriesMap} />
          </Suspense>
        </MetricWrapper>

        <MetricWrapper
          id='platforms-playtime'
          title='Your longest used platforms'
        >
          <Suspense
            fallback={
              <ChartSkeleton type='doughnut' className='switchable-chart' />
            }
          >
            <PlatformsPlaytime platforms={platformsMap} />
          </Suspense>
        </MetricWrapper>
      </div>

      <PlatformsPeriodTops platforms={platformsMap.toArray()} />

      <MetricWrapper id='rated-platforms' title='Your highest rated platforms'>
        <Suspense fallback={<HighestRatedPlatformsSkeleton />}>
          <HighestRatedPlatforms platforms={platformsMap} genres={genresMap} />
        </Suspense>
      </MetricWrapper>
    </>
  );
}
