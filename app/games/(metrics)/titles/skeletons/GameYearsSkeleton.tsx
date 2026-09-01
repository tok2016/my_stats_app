import { MetricId } from '@ts/games/metric';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

type GameYearsSkeletonProps = {
  metricId: MetricId;
};

export default function GameYearsSkeleton({
  metricId
}: GameYearsSkeletonProps) {
  return (
    <MetricWrapper id={metricId}>
      <ChartSkeleton type='line' />
    </MetricWrapper>
  );
}
