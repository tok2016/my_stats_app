import { GameTitlesMetricsIds } from '@lib/metrics/metrics-id';

import { GameMetricsSkeletons } from '../GameMetrics';

export default function GameTitlesLoading() {
  return (
    <>
      {GameTitlesMetricsIds.map((metricId) => GameMetricsSkeletons[metricId])}
    </>
  );
}
