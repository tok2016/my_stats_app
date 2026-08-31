import { GameGenresMetricsIds } from '@lib/metrics/metrics-id';

import { GameMetricsSkeletons } from '../GameMetrics';

export default function GenresLoading() {
  return (
    <>{GameGenresMetricsIds.forEach((genre) => GameMetricsSkeletons[genre])}</>
  );
}
