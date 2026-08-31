import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import PeriodTopsSkeletons from '@components/data-blocks/PeriodTopsSkeletons';

import HighestRatedStudiosSkeleton from './skeletons/HighestRatedStudiosSkeleton';
import StudiosCountSkeleton from './skeletons/StudiosCountSkeleton';

export default function GameStudiosLoading() {
  return (
    <>
      <MetricWrapper id='developers-count' title='Your favorite developers'>
        <StudiosCountSkeleton />
      </MetricWrapper>

      <MetricWrapper id='publishers-count' title='Your favorite publishers'>
        <StudiosCountSkeleton />
      </MetricWrapper>

      <PeriodTopsSkeletons metricId='studios-periods' />

      <MetricWrapper
        id='developers-rating'
        title='Your highest rated developers'
      >
        <HighestRatedStudiosSkeleton />
      </MetricWrapper>

      <MetricWrapper
        id='publishers-rating'
        title='Your highest rated publishers'
      >
        <HighestRatedStudiosSkeleton />
      </MetricWrapper>

      <MetricWrapper
        id='developers-countries'
        title='Your favorite developers around the world'
      >
        <ChartSkeleton type='map' />
      </MetricWrapper>
    </>
  );
}
