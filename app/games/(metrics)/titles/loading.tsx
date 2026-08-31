import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import PeriodTopsSkeletons from '@components/data-blocks/PeriodTopsSkeletons';

import GamePlaytimeSkeleton from './skeletons/GamesPlaytimeSkeleton';
import HighestRatedGamesSkeleton from './skeletons/HigestRatedGamesSkeleton';
import SeriesCountSkeleton from './skeletons/SeriesCountSkeleton';

export default function GameTitlesLoading() {
  return (
    <>
      <MetricWrapper id='games-playtime' title='Your longest played games'>
        <GamePlaytimeSkeleton />
      </MetricWrapper>

      <MetricWrapper id='favorite-games' title='Your favorite games'>
        <HighestRatedGamesSkeleton />
      </MetricWrapper>

      <PeriodTopsSkeletons metricId='games-periods' />

      <MetricWrapper id='game-releases' title='Game releases per year'>
        <ChartSkeleton type='line' />
      </MetricWrapper>

      <MetricWrapper id='game-playdates' title='Your played games per year'>
        <ChartSkeleton type='line' />
      </MetricWrapper>

      <MetricWrapper
        id='countries-by-games'
        title='Your favorite games around the world'
      >
        <ChartSkeleton type='map' />
      </MetricWrapper>

      <MetricWrapper id='top-series' title='Your favorite game series'>
        <SeriesCountSkeleton />
      </MetricWrapper>
    </>
  );
}
