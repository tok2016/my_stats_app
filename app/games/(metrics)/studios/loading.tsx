import MapSkeleton from '@components/charts/MapSkeleton';
import Metric from '@components/data-blocks/Metric';
import PeriodTopsSkeletons from '@components/data-blocks/PeriodTopsSkeletons';

import HighestRatedStudiosSkeleton from './skeletons/HighestRatedStudiosSkeleton';
import StudiosCountSkeleton from './skeletons/StudiosCountSkeleton';

export default function GameStudiosLoading() {
  return (
    <>
      <Metric id='developers-count' title='Your favorite developers'>
        <StudiosCountSkeleton />
      </Metric>

      <Metric id='publishers-count' title='Your favorite publishers'>
        <StudiosCountSkeleton />
      </Metric>

      <PeriodTopsSkeletons metricId='studios-periods' />

      <Metric id='developers-rating' title='Your highest rated developers'>
        <HighestRatedStudiosSkeleton />
      </Metric>

      <Metric id='publishers-rating' title='Your highest rated publishers'>
        <HighestRatedStudiosSkeleton />
      </Metric>

      <Metric
        id='developers-countries'
        title='Your favorite developers around the world'
      >
        <MapSkeleton />
      </Metric>
    </>
  );
}
