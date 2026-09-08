'use client';

import Game from '@ts/games/game';
import { MetricId } from '@ts/games/metric';

import ObjectMapArray from '@lib/object-map-array';

import { GameMetrics } from './GameMetrics';

type MetricPageProps = {
  games: Game[];
  metrics: MetricId[];
  userId: string;
};

export default function MetricPage({
  games,
  metrics,
  userId
}: MetricPageProps) {
  const gamesMapArray = new ObjectMapArray(games, 'id');
  return (
    <>
      {metrics.map((metric) =>
        GameMetrics[metric]({ games: gamesMapArray, metricId: metric, userId })
      )}
    </>
  );
}
