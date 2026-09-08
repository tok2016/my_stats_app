import { StudiosMetricsIds } from '@lib/metrics/metrics-id';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import { GameMetricsSkeletons } from '../components/GameMetrics';

export default function GameStudiosLoading() {
  return (
    <>
      {StudiosMetricsIds.map((metricId) => (
        <MetricWrapper id={metricId} key={metricId}>
          {GameMetricsSkeletons[metricId]}
        </MetricWrapper>
      ))}
    </>
  );
}
