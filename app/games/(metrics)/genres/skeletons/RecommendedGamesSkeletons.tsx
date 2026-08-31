import MetricWrapper from '@components/data-blocks/MetricWrapper';

import RecommendedGameSkeleton from '@app/games/components/RecommendedGameSkeleton';

const GAMES_SKELETONS_TO_SHOW = 5;

export default function RecommendedGamesSkeletons() {
  return (
    <MetricWrapper id='recommended-games'>
      <div className='recommended-games'>
        {Array.from({ length: GAMES_SKELETONS_TO_SHOW }).map((_, i) => (
          <RecommendedGameSkeleton
            key={`recommended-game-${i}`}
            parentKey={`recommended-game-${i}`}
          />
        ))}
      </div>
    </MetricWrapper>
  );
}
