import { Suspense } from 'react';

import Game from '@ts/games/game';

import { getGamesMap } from '@lib/server-actions';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import Metric from '@components/data-blocks/Metric';

import { getItemsMap } from '@app/games/lib/actions';

import { isIgdbGenre, isIgdbSeries } from '../utils';
import HighestRatedPlatforms from './metrics/HighestRatedPlatforms';
import PlatformsCount from './metrics/PlatformsCount';
import PlatformsPeriodTops from './metrics/PlatformsPertiodTops';
import PlatformsPlaytime from './metrics/PlatformsPlaytime';
import HighestRatedPlatformsSkeleton from './skeletons/HighestRatedPlatformsSkeleton';

const isIgdbPlatform = (
  value: unknown
): value is NonNullable<Game['platform']> =>
  typeof (value as Game['platform'])?.name !== 'undefined';

export default async function GamesPlatformsPage() {
  const gamesMap = await getGamesMap();
  const platformsMap = await getItemsMap(gamesMap, 'platform', isIgdbPlatform);
  const seriesMap = await getItemsMap(gamesMap, 'series', isIgdbSeries);
  const genresMap = await getItemsMap(gamesMap, 'genres', isIgdbGenre);

  return (
    <>
      <div className='double-doughnut'>
        <Metric id='platforms-count' title='Your biggest platforms'>
          <Suspense
            fallback={
              <ChartSkeleton type='doughnut' className='switchable-chart' />
            }
          >
            <PlatformsCount platformsMap={platformsMap} seriesMap={seriesMap} />
          </Suspense>
        </Metric>

        <Metric id='platforms-playtime' title='Your longest used platforms'>
          <Suspense
            fallback={
              <ChartSkeleton type='doughnut' className='switchable-chart' />
            }
          >
            <PlatformsPlaytime platformsMap={platformsMap} />
          </Suspense>
        </Metric>
      </div>

      <PlatformsPeriodTops platformsMap={platformsMap} />

      <Metric id='rated-platforms' title='Your highest rated platforms'>
        <Suspense fallback={<HighestRatedPlatformsSkeleton />}>
          <HighestRatedPlatforms
            platformsMap={platformsMap}
            genresMap={genresMap}
          />
        </Suspense>
      </Metric>
    </>
  );
}
