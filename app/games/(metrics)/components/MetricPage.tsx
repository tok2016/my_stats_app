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

/**
 * Renders metrics by given metrics and user ids.
 * @param props
 * @param props.games - Games of user.
 * @param props.metrics - Metrics to add to the page.
 * @param props.userId - User whose metrics will be fetched.
 * @returns Rendered metric components.
 */
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
