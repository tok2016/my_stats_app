import Game from '@ts/games/game';
import { GameMetricId } from '@ts/games/metric';

import ObjectMapArray from '@lib/object-map-array';

import { GameMetrics } from './GameMetrics';

type MetricProps = {
  id: GameMetricId;
  games: ObjectMapArray<Game, 'id'> | Array<Game>;
  userId: string;
};

export default function Metric({ id, games, userId }: MetricProps) {
  return GameMetrics[id]({
    games: Array.isArray(games) ? new ObjectMapArray(games, 'id') : games,
    metricId: id,
    userId
  });
}
