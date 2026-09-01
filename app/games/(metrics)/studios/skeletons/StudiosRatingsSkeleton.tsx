import { MetricId } from '@ts/games/metric';

import Skeleton from '@components/Skeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import MultipleRating from '@components/data-blocks/MultipleRatings';

const MAX_BLOCKS = 5;

type StudiosRatingsSkeletonProps = {
  metricId: MetricId;
};

export default function StudiosRatingsSkeleton({
  metricId
}: StudiosRatingsSkeletonProps) {
  return (
    <MetricWrapper id={metricId}>
      <div className='blocks-group'>
        {Array.from({ length: MAX_BLOCKS }).map((_, i) => (
          <div
            key={`$rated-studio-skeleton-${i}`}
            className='data-block rated-studio'
          >
            <Skeleton type='h3' />

            <div className='data-block-content'>
              <span className='min'>Best game:</span>
              <Skeleton type='image' className='game-cover' />
              <Skeleton />
            </div>

            <MultipleRating />
          </div>
        ))}
      </div>
    </MetricWrapper>
  );
}
