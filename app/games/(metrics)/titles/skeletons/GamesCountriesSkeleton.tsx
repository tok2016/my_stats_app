import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

export default function GamesCountriesSkeleton() {
  return (
    <MetricWrapper id='games-countries'>
      <ChartSkeleton type='map' />
    </MetricWrapper>
  );
}
