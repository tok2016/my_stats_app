import { MetricId } from '@ts/games/metric';

import Skeleton from '@components/Skeleton';
import AdjacentChart from '@components/charts/AdjacentChart';
import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

type StudiosCountPlaytimeSkeletonProps = {
  metricId: MetricId;
};

export default function StudiosCountPlaytimeSkeleton({
  metricId
}: StudiosCountPlaytimeSkeletonProps) {
  return (
    <MetricWrapper id={metricId}>
      <AdjacentChart>
        <Skeleton type='tablet' rows={10} />
        <ChartSkeleton type='bar' />
      </AdjacentChart>
    </MetricWrapper>
  );
}
