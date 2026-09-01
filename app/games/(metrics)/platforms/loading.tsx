import { PlatformsMetricsIds } from '@lib/metrics/metrics-id';

import { GameMetricsSkeletons } from '../GameMetrics';

export default function PlatformsLoading() {
  return (
    <>{PlatformsMetricsIds.map((metricId) => GameMetricsSkeletons[metricId])}</>
  );
}
