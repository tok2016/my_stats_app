import Skeleton from '@components/Skeleton';

const RATED_GENRES_COUNT = 5;

function RatedGameSkeleton() {
  return (
    <div className='data-block genre-rating-block'>
      <Skeleton type='h4' unitClassName='rating-title-skeleton' />

      <div className='data-block-content'>
        <span className='min'>Best game:</span>
        <Skeleton type='image' className='game-cover' />
        <Skeleton type='text' fontSize='small' />
        <Skeleton type='text' fontSize='min' />
      </div>
    </div>
  );
}

export default function HighestRatedGenresSkeleton() {
  return (
    <section className='metric'>
      <Skeleton type='h3' width='50%' />

      <div className='blocks-group'>
        {Array.from({ length: RATED_GENRES_COUNT }).map((_, i) => (
          <RatedGameSkeleton key={`rated-genre-skeleton-${i}`} />
        ))}
      </div>
    </section>
  );
}
