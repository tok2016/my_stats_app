import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import PeriodTopsSkeletons from '@components/data-blocks/PeriodTopsSkeletons';

import HighestRatedPlatformsSkeleton from './skeletons/HighestRatedPlatformsSkeleton';

export default function PlatformsLoading() {
  return (
    <>
      <div className='double-doughnut'>
        <MetricWrapper id='platforms-count' title='Your biggest platforms'>
          <ChartSkeleton type='doughnut' className='switchable-chart' />
        </MetricWrapper>
        <MetricWrapper
          id='platforms-playtime'
          title='Your longest used platforms'
        >
          <ChartSkeleton type='doughnut' className='switchable-chart' />
        </MetricWrapper>
      </div>

      <PeriodTopsSkeletons metricId='platform-periods' />

      <MetricWrapper id='rated-platforms' title='Your highest rated platforms'>
        <HighestRatedPlatformsSkeleton />
      </MetricWrapper>
    </>
  );
}
