import Skeleton from '@components/Skeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

const SKELETONS_COUNT = 3;
const TABLE_ROWS_COUNT = 5;

function GenreTopSkeleton() {
  return (
    <div className='genre-top'>
      <Skeleton type='h4' />
      <Skeleton
        type='tablet'
        unitClassName='game-row-skeleton'
        rows={TABLE_ROWS_COUNT}
      />
    </div>
  );
}

export default function GenreTopsSkeleton() {
  return (
    <MetricWrapper
      id='top-genres-games'
      renderTitle={() => <Skeleton type='h3' width='50%' />}
    >
      <Skeleton type='h3' width='50%' />

      <div className='genres-tops'>
        {Array.from({ length: SKELETONS_COUNT }).map((_, i) => (
          <GenreTopSkeleton key={`genre-top-skeleton-${i}`} />
        ))}
      </div>
    </MetricWrapper>
  );
}
