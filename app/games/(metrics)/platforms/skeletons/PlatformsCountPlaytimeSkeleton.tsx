import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import Submetric from '@components/data-blocks/Submetric';

export default function PlatformsCountPlaytimeSkeleton() {
  return (
    <MetricWrapper id='platforms-count-playtime'>
      <div className='double-doughnut'>
        <Submetric id='platforms-count'>
          <ChartSkeleton type='doughnut' className='switchable-chart' />
        </Submetric>

        <Submetric id='platforms-playtime'>
          <ChartSkeleton type='doughnut' className='switchable-chart' />
        </Submetric>
      </div>
    </MetricWrapper>
  );
}
