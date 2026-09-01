import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import Submetric from '@components/data-blocks/Submetric';

export default function GenresCountPlaytimeSkeleton() {
  return (
    <MetricWrapper id='genres-count-playtime'>
      <div className='double-doughnut'>
        <Submetric id='genres-count'>
          <ChartSkeleton type='doughnut' className='switchable-chart' />
        </Submetric>

        <Submetric id='genres-playtime'>
          <ChartSkeleton type='doughnut' className='switchable-chart' />
        </Submetric>
      </div>
    </MetricWrapper>
  );
}
