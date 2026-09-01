import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

export default function PlatformsCountPlaytimeSkeleton() {
  return (
    <MetricWrapper id='platforms-count-playtime'>
      <div className='double-doughnut'>
        <ChartSkeleton type='doughnut' className='switchable-chart' />
        <ChartSkeleton type='doughnut' className='switchable-chart' />
      </div>
    </MetricWrapper>
  );
}
