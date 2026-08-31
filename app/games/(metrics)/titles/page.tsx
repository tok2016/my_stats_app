import { Suspense } from 'react';

import { getGames } from '@lib/server-actions';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

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
  const games = await getGames();

  return (
    <>
      <MetricWrapper id='games-playtime' title='Your longest played games'>
        <Suspense fallback={<GamePlaytimeSkeleton />}>
          <GamesPlaytime games={games} />
        </Suspense>
      </MetricWrapper>

      <MetricWrapper id='favorite-games' title='Your favorite games'>
        <Suspense fallback={<HighestRatedGamesSkeleton />}>
          <HighestRatedGames games={games} />
        </Suspense>
      </MetricWrapper>

      <GamesPeriodTops games={games.toArray()} />

      <MetricWrapper id='game-releases' title='Game releases per year'>
        <Suspense fallback={<ChartSkeleton type='line' />}>
          <GameReleases />
        </Suspense>
      </MetricWrapper>

      <MetricWrapper id='game-playdates' title='Your played games per year'>
        <Suspense fallback={<ChartSkeleton type='line' />}>
          <GamePlaydates />
        </Suspense>
      </MetricWrapper>

      <MetricWrapper
        id='countries-by-games'
        title='Your favorite games around the world'
      >
        <Suspense fallback={<ChartSkeleton type='map' />}>
          <GamesCountries />
        </Suspense>
      </MetricWrapper>

      <MetricWrapper id='top-series' title='Your favorite game series'>
        <Suspense fallback={<SeriesCountSkeleton />}>
          <SeriesCount games={games} />
        </Suspense>
      </MetricWrapper>
    </>
  );
}
