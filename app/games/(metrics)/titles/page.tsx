import { Suspense } from 'react';

import { getGamesMap } from '@lib/server-actions';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import Metric from '@components/data-blocks/Metric';

import GamePlaydates from './metrics/GamePlayDates';
import GameReleases from './metrics/GameReleases';
import GamesCountries from './metrics/GamesCountries';
import GamesPeriodTops from './metrics/GamesPeriodTops';
import GamesPlaytime from './metrics/GamesPlaytime';
import HighestRatedGames from './metrics/HighestRatedGames';
import SeriesCount from './metrics/SeriesCount';
import GamePlaytimeSkeleton from './skeletons/GamesPlaytimeSkeleton';
import HighestRatedGamesSkeleton from './skeletons/HigestRatedGamesSkeleton';
import SeriesCountSkeleton from './skeletons/SeriesCountSkeleton';

export default async function GamesTitlesPage() {
  const gamesMap = await getGamesMap();

  return (
    <>
      <Metric id='games-playtime' title='Your longest played games'>
        <Suspense fallback={<GamePlaytimeSkeleton />}>
          <GamesPlaytime gamesMap={gamesMap} />
        </Suspense>
      </Metric>

      <Metric id='favorite-games' title='Your favorite games'>
        <Suspense fallback={<HighestRatedGamesSkeleton />}>
          <HighestRatedGames gamesMap={gamesMap} />
        </Suspense>
      </Metric>

      <GamesPeriodTops gamesMap={gamesMap} />

      <Metric id='game-releases' title='Game releases per year'>
        <Suspense fallback={<ChartSkeleton type='line' />}>
          <GameReleases />
        </Suspense>
      </Metric>

      <Metric id='game-playdates' title='Your played games per year'>
        <Suspense fallback={<ChartSkeleton type='line' />}>
          <GamePlaydates />
        </Suspense>
      </Metric>

      <Metric
        id='countries-by-games'
        title='Your favorite games around the world'
      >
        <Suspense fallback={<ChartSkeleton type='map' />}>
          <GamesCountries />
        </Suspense>
      </Metric>

      <Metric id='top-series' title='Your favorite game series'>
        <Suspense fallback={<SeriesCountSkeleton />}>
          <SeriesCount gamesMap={gamesMap} />
        </Suspense>
      </Metric>
    </>
  );
}
