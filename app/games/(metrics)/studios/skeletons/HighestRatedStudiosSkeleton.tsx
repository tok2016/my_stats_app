import Skeleton from '@components/Skeleton';
import MultipleRating from '@components/data-blocks/MultipleRatings';

const MAX_BLOCKS = 5;

export default function HighestRatedStudiosSkeleton() {
  return (
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
            <Skeleton type='text' fontSize='small' />
          </div>

          <MultipleRating />
        </div>
      ))}
    </div>
  );
}
