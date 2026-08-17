import { RecommendedMetric } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import Metric from '@components/data-blocks/Metric';

import RecommendedGameBlock from '@app/games/components/RecommendedGameBlock';

import { RecommendationCategories, RecommendationIds } from '../../utils';

export default async function RecommendedGames() {
  const recommendations = await getMetricData<RecommendedMetric>(
    '/api/games/genres/recommend',
    {
      favorite: [],
      other: []
    }
  );

  return Object.entries(recommendations).map(([key, games]) => (
    <Metric
      key={key}
      id={RecommendationIds[key as keyof RecommendedMetric]}
      title={RecommendationCategories[key as keyof RecommendedMetric]}
      className='recommended-group'
    >
      <div className='recommended-games'>
        {games.map((game) => (
          <RecommendedGameBlock key={game.id} {...game} />
        ))}
      </div>
    </Metric>
  ));
}
