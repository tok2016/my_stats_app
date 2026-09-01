import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

export default function StudiosCountriesSkeleton() {
  return (
    <MetricWrapper id='developers-countries'>
      <ChartSkeleton type='map' />
    </MetricWrapper>
  );
}
