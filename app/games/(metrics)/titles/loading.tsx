import { GameTitlesMetricsIds } from '@lib/metrics/metrics-id';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import { GameMetricsSkeletons } from '../components/GameMetrics';

export default function GameTitlesLoading() {
  return (
    <>
      {GameTitlesMetricsIds.map((metricId) => (
        <MetricWrapper id={metricId} key={metricId}>
          {GameMetricsSkeletons[metricId]}
        </MetricWrapper>
      ))}
    </>
  );
}
