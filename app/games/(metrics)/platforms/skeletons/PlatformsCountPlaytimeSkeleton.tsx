import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

export default function PlatformsCountPlaytimeSkeleton() {
  return (
    <div className='double-doughnut'>
      <MetricWrapper id='platforms-count' submetric>
        <ChartSkeleton type='doughnut' className='switchable-chart' />
      </MetricWrapper>

      <MetricWrapper id='platforms-playtime' submetric>
        <ChartSkeleton type='doughnut' className='switchable-chart' />
      </MetricWrapper>
    </div>
  );
}
