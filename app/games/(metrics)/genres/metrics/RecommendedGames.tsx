import { Suspense } from 'react';

import { RecommendedGame } from '@ts/games/game';
import { MetricContentProps, MetricId } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import RecommendedGameBlock from '@app/games/components/RecommendedGameBlock';

import RecommendedGamesSkeletons from '../skeletons/RecommendedGamesSkeletons';

async function RecommendedGamesList({ metricId }: { metricId: MetricId }) {
  const recommendations = await getMetricData<RecommendedGame[]>(
    '/api/games/genres/recommend',
    []
  );

  return (
    <MetricWrapper id={metricId} className='recommended-group'>
      <div className='recommended-games'>
        {recommendations.map((game) => (
          <RecommendedGameBlock key={game.id} {...game} />
        ))}
      </div>
    </MetricWrapper>
  );
}

export default function RecommendedGames({ metricId }: MetricContentProps) {
  return (
    <Suspense fallback={<RecommendedGamesSkeletons />}>
      <RecommendedGamesList metricId={metricId} />
    </Suspense>
  );
}
