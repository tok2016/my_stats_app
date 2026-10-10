'use client';

import { RecommendedGame } from '@ts/games/game';
import { MetricCoreProps } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import RecommendedGameBlock from '@app/games/components/RecommendedGameBlock';
import RecommendedGameSkeleton from '@app/games/components/RecommendedGameSkeleton';

import FetchMetric from '../../components/FetchMetric';

const GAMES_SKELETONS_TO_SHOW = 5;

/**
 * @param params - Search params with user id.
 * @returns Recommended games list or error data.
 */
const fetchRecommendations = async (params: {
  userId: string;
}): Promise<MetricResponse<RecommendedGame[]>> => {
  const recommendations = await getMetricClient<RecommendedGame[]>(
    '/api/games/genres/recommend',
    params
  );

  return recommendations;
};

export function RecommendedGamesSkeleton() {
  return (
    <div className='recommended-games'>
      {Array.from({ length: GAMES_SKELETONS_TO_SHOW }).map((_, i) => (
        <RecommendedGameSkeleton
          key={`recommended-game-${i}`}
          parentKey={`recommended-game-${i}`}
        />
      ))}
    </div>
  );
}

/**
 * @param props
 * @param props.userId - User whose metric will be fetched.
 * @returns Metric component of games recommended to user.
 */
export default function RecommendedGames({ userId }: MetricCoreProps) {
  return (
    <MetricWrapper id='recommended-games' className='recommended-group'>
      <FetchMetric
        fetchMetricData={fetchRecommendations}
        fallback={<RecommendedGamesSkeleton />}
        metric={(data) => (
          <div className='recommended-games'>
            {data.map((game) => (
              <RecommendedGameBlock key={game.id} {...game} />
            ))}
          </div>
        )}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
