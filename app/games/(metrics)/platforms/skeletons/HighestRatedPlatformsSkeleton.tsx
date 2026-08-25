import Skeleton from '@components/Skeleton';

const MAX_PLATFORMS = 5;
const MAX_GAMES = 5;

type RatedPlatformSkeletonProps = {
  skeletonKey: string;
};

function RatedPlatformSkeleton({ skeletonKey }: RatedPlatformSkeletonProps) {
  return (
    <div className='data-block rated-platform'>
      <Skeleton type='h4' unitClassName='rating-title-skeleton' />
      <Skeleton />
      <span className='min'>Best games: </span>
      <div className='data-block-content'>
        {Array.from({ length: MAX_GAMES }).map((_, i) => (
          <div key={`${skeletonKey}-game-${i}`} className='game-table-title'>
            <Skeleton type='image' className='game-cover game-table-cover' />
            <Skeleton className='game-table-name' />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HighestRatedPlatformsSkeleton({}) {
  return (
    <div className='blocks-group'>
      {Array.from({ length: MAX_PLATFORMS }).map((_, i) => (
        <RatedPlatformSkeleton
          key={`rated-platform-skeleton-${i}`}
          skeletonKey={`rated-platform-skeleton-${i}`}
        />
      ))}
    </div>
  );
}
