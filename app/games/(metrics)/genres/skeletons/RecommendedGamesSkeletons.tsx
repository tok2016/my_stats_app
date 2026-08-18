import Metric from '@components/data-blocks/Metric';

import RecommendedGameSkeleton from '@app/games/components/RecommendedGameSkeleton';

import { RecommendationCategories, RecommendationIds } from '../../utils';

const GAMES_SKELETONS_TO_SHOW = 5;

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
