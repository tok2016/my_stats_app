import Skeleton from '@components/Skeleton';
import AdjacentChart from '@components/charts/AdjacentChart';
import { ChartSkeleton } from '@components/charts/ChartSkeleton';

export default function StudiosCountSkeleton() {
  return (
    <AdjacentChart>
      <Skeleton type='tablet' rows={10} />
      <ChartSkeleton type='bar' />
    </AdjacentChart>
  );
}
