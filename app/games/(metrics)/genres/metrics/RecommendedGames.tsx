'use client';

import { RecommendedGame } from '@ts/games/game';
import { MetricContentProps } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import RecommendedGameBlock from '@app/games/components/RecommendedGameBlock';
import RecommendedGameSkeleton from '@app/games/components/RecommendedGameSkeleton';

import FetchMetric from '../../components/FetchMetric';

const GAMES_SKELETONS_TO_SHOW = 5;

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

export default function RecommendedGames({
  metricId,
  userId
}: MetricContentProps) {
  return (
    <MetricWrapper id={metricId} className='recommended-group'>
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
