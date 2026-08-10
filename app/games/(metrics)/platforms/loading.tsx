import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import Metric from '@components/data-blocks/Metric';
import PeriodTopsSkeletons from '@components/data-blocks/PeriodTopsSkeletons';

import HighestRatedPlatformsSkeleton from './skeletons/HighestRatedPlatformsSkeleton';

export default function PlatformsLoading() {
  return (
    <>
      <div className='double-doughnut'>
        <Metric id='platforms-count' title='Your biggest platforms'>
          <ChartSkeleton type='doughnut' />
        </Metric>
        <Metric id='platforms-playtime' title='Your longest used platforms'>
          <ChartSkeleton type='doughnut' />
        </Metric>
      </div>

      <PeriodTopsSkeletons metricId='platform-periods' />

      <Metric id='rated-platforms' title='Your highest rated platforms'>
        <HighestRatedPlatformsSkeleton />
      </Metric>
    </>
  );
}
