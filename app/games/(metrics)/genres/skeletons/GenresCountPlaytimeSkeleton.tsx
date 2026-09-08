import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

export default function GenresCountPlaytimeSkeleton() {
  return (
    <div className='double-doughnut'>
      <MetricWrapper id='genres-count' submetric>
        <ChartSkeleton type='doughnut' className='switchable-chart' />
      </MetricWrapper>

      <MetricWrapper id='genres-playtime' submetric>
        <ChartSkeleton type='doughnut' className='switchable-chart' />
      </MetricWrapper>
    </div>
  );
}
