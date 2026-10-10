'use client';

import { GameItemsData, MetricId } from '@ts/games/metric';

import ObjectMapArray from '@lib/object-map-array';

import { GameMetrics } from './GameMetrics';

type MetricPageProps = {
  itemsData: GameItemsData;
  metrics: MetricId[];
  userId: string;
};

/**
 * Renders metrics by given metrics and user ids.
 * @param props
 * @param props.genres - Genres of user' games.
 * @param props.platforms - Platforms of user's platforms.
 * @param props.studios - Studios of user's games.
 * @param props.metrics - Metrics to add to the page.
 * @param props.userId - User whose metrics will be fetched.
 * @returns Rendered metric components.
 */
export default function MetricPage({
  itemsData,
  metrics,
  userId
}: MetricPageProps) {
  return (
    <>
      {metrics.map((metricId) =>
        GameMetrics[metricId]({
          genres: new ObjectMapArray(itemsData.genres, 'id'),
          studios: new ObjectMapArray(itemsData.studios, 'id'),
          platforms: new ObjectMapArray(itemsData.platforms, 'id'),
          series: new ObjectMapArray(itemsData.series, 'id'),
          userId,
          metricId
        })
      )}
    </>
  );
}
