import { StudiosMetricsIds } from '@lib/metrics/metrics-id';

import { GameMetricsSkeletons } from '../GameMetrics';

export default function GameStudiosLoading() {
  return (
    <>{StudiosMetricsIds.map((metricId) => GameMetricsSkeletons[metricId])}</>
  );
}
