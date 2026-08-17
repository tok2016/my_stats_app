import Skeleton from '@components/Skeleton';
import GameCollageSkeleton from '@components/data-blocks/GameCollageSkeleton';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import PropBlock from '../../../../components/data-blocks/PropBlock';

type TopGameSkeletonProps = {
  parentKey: string;
  index: number;
};

const TOP_GAMES_SKELETONS = 12;

function TopGameSkeleton({ parentKey, index }: TopGameSkeletonProps) {
  return (
    <div className='data-block top-game'>
      <Skeleton type='h4' />
      <GameCollageSkeleton parentKey={parentKey} />

      <div className='data-block-grid min'>
        <PropBlock title='Developer'>
          <Skeleton fontSize='min' lineHeight='wide' rows={2} />
        </PropBlock>

        <PropBlock title='Publisher'>
          <Skeleton fontSize='min' lineHeight='wide' rows={2} />
        </PropBlock>
      </div>

      <MultipleRating className='pre-rank-prop' />
      <div className='data-block-rank'>{index + 1}</div>
    </div>
  );
}

export default function HighestRatedGamesSkeleton() {
  return (
    <div className='top-games-grid'>
      {Array.from({ length: TOP_GAMES_SKELETONS }).map((_, i) => (
        <TopGameSkeleton
          key={`top-game-skeleton-${i}`}
          parentKey={`top-game-skeleton-${i}`}
          index={i}
        />
      ))}
    </div>
  );
}
