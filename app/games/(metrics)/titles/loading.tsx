import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import Metric from '@components/data-blocks/Metric';
import PeriodTopsSkeletons from '@components/data-blocks/PeriodTopsSkeletons';

import GamePlaytimeSkeleton from './skeletons/GamesPlaytimeSkeleton';
import HighestRatedGamesSkeleton from './skeletons/HigestRatedGamesSkeleton';
import SeriesCountSkeleton from './skeletons/SeriesCountSkeleton';

export default function GameTitlesLoading() {
  return (
    <>
      <Metric id='games-playtime' title='Your longest played games'>
        <GamePlaytimeSkeleton />
      </Metric>

      <Metric id='favorite-games' title='Your favorite games'>
        <HighestRatedGamesSkeleton />
      </Metric>

      <PeriodTopsSkeletons metricId='games-periods' />

      <Metric id='game-releases' title='Game releases per year'>
        <ChartSkeleton type='line' />
      </Metric>

      <Metric id='game-playdates' title='Your played games per year'>
        <ChartSkeleton type='line' />
      </Metric>

      <Metric
        id='countries-by-games'
        title='Your favorite games around the world'
      >
        <ChartSkeleton type='map' />
      </Metric>

      <Metric id='top-series' title='Your favorite game series'>
        <SeriesCountSkeleton />
      </Metric>
    </>
  );
}
