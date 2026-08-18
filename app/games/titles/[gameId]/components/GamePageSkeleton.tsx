import Rating from '@components/Rating';
import Skeleton from '@components/Skeleton';
import Metric from '@components/data-blocks/Metric';
import PropBlock from '@components/data-blocks/PropBlock';

import PlaytimeRating from '@app/games/components/PlaytimeRating';
import RecommendedGameSkeleton from '@app/games/components/RecommendedGameSkeleton';

const SCREENSHOTS_SKELETONS_COUNT = 5;
const RECOMMENDED_GAMES_SKELETONS = 10;

type RatingBlockSkeletonProps = {
  children: React.ReactNode;
  title: string;
};

function GameDetailsSkeleton() {
  return (
    <section id='details' className='game-detials'>
      <div className='game-details-collage'>
        <Skeleton type='image' className='game-cover' />

        <div className='screenshots-collage'>
          <div className='title-screenshot'>
            <Skeleton type='image' className='screenshot' />
          </div>

          <div className='screenshots-carousel'>
            {Array.from({ length: SCREENSHOTS_SKELETONS_COUNT }).map((_, i) => (
              <Skeleton
                type='image'
                className='screenshot'
                key={`screenshot-skeleton-${i}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className='game-detials-info'>
        <div className='game-details-info-block'>
          <PropBlock title='Platfrom'>
            <Skeleton />
          </PropBlock>

          <PropBlock title='Release date'>
            <Skeleton />
          </PropBlock>

          <PropBlock title='Last time played'>
            <Skeleton />
          </PropBlock>
        </div>

        <div className='game-details-info-block'>
          <PropBlock title='Developers'>
            <Skeleton rows={2} />
          </PropBlock>

          <PropBlock title='Publishers'>
            <Skeleton rows={2} />
          </PropBlock>

          <PropBlock title='Series'>
            <Skeleton />
          </PropBlock>
        </div>

        <div className='game-details-info-block'>
          <PropBlock title='Genres'>
            <Skeleton rows={3} />
          </PropBlock>

          <PropBlock title='Themes'>
            <Skeleton rows={3} />
          </PropBlock>
        </div>
      </div>
    </section>
  );
}

function RatingBlockSkeleton({ children, title }: RatingBlockSkeletonProps) {
  return (
    <div className='rating-block'>
      <h3>{title}</h3>
      {children}

      <div className='positions'>
        <div className='position'>
          <Skeleton width='100%' fontSize='large' className='position-number' />
          <p className='position-label'>all games</p>
        </div>

        <div className='position'>
          <Skeleton width='100%' fontSize='large' className='position-number' />
          <p className='position-label'>series</p>
        </div>
      </div>
    </div>
  );
}

function GameRatingsSkeleton() {
  return (
    <section id='game-ratings'>
      <RatingBlockSkeleton title='Your rating'>
        <Rating />
      </RatingBlockSkeleton>

      <RatingBlockSkeleton title='Critics rating'>
        <Rating />
      </RatingBlockSkeleton>

      <RatingBlockSkeleton title='Users rating'>
        <Rating />
      </RatingBlockSkeleton>

      <RatingBlockSkeleton title='Playtime'>
        <PlaytimeRating />
      </RatingBlockSkeleton>
    </section>
  );
}

export default function GamePageSkeleton() {
  return (
    <>
      <div className='games-page-name'>
        <Skeleton width='30%' type='h2' />
      </div>

      <div className='game-page-content'>
        <GameDetailsSkeleton />
        <GameRatingsSkeleton />
        <Metric id='similar-games' title='Similar games'>
          <div className='recommended-games'>
            {Array.from({ length: RECOMMENDED_GAMES_SKELETONS }).map((_, i) => (
              <RecommendedGameSkeleton
                key={`recommended-game-${i}`}
                parentKey={`recommended-game-${i}`}
              />
            ))}
          </div>
        </Metric>
      </div>
    </>
  );
}
