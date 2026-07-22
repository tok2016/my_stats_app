import Skeleton from '@components/Skeleton';
import GameCollageSkeleton from '@components/data-blocks/GameCollageSkeleton';
import Metric from '@components/data-blocks/Metric';

import { RecommendationCategories, RecommendationIds } from '../utils';

type RecommendedGameSkeletonProps = {
  parentKey: string;
};

const GAMES_SKELETONS_TO_SHOW = 5;

function RecommendedGameSkeleton({ parentKey }: RecommendedGameSkeletonProps) {
  return (
    <div className='data-block recommended-game'>
      <Skeleton type='h4' />

      <GameCollageSkeleton parentKey={parentKey} />

      <Skeleton type='text' rows={2} fontSize='small' />
      <Skeleton type='text' rows={2} fontSize='small' />
    </div>
  );
}

export default function RecommendedGamesSkeletons() {
  const ids = Object.values(RecommendationIds);
  const categories = Object.values(RecommendationCategories);

  return Array.from({ length: 2 }).map((_, i) => (
    <Metric
      key={`recommend-skeletons-${i}`}
      id={ids[i]}
      title={categories[i]}
      className='recommended-group'
    >
      <div className='recommended-games'>
        {Array.from({ length: GAMES_SKELETONS_TO_SHOW }).map((_, i) => (
          <RecommendedGameSkeleton
            key={`recommended-game-${i}`}
            parentKey={`recommended-game-${i}`}
          />
        ))}
      </div>
    </Metric>
  ));
}
