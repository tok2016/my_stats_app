import Skeleton from '@components/Skeleton';
import AdjacentChart from '@components/charts/AdjacentChart';

export default function StudiosCountSkeleton() {
  return (
    <AdjacentChart>
      <Skeleton type='tablet' rows={10} />
      <Skeleton type='graph' />
    </AdjacentChart>
  );
}
