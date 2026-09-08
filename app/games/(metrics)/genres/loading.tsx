import { GameGenresMetricsIds } from '@lib/metrics/metrics-id';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import { GameMetricsSkeletons } from '../components/GameMetrics';

export default function GenresLoading() {
  return (
    <>
      {GameGenresMetricsIds.map((metric) => (
        <MetricWrapper id={metric} key={metric}>
          {GameMetricsSkeletons[metric]}
        </MetricWrapper>
      ))}
    </>
  );
}
