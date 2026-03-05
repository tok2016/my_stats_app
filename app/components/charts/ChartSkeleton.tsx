import { CustomChartType } from '@ts/ui/charts-data';

import Skeleton from '@components/Skeleton';

import { ChartClasses } from './chart-styles';

type ChartSkeletonProps = {
  className?: string;
  type: CustomChartType;
};

export function ChartSkeleton({ className, type }: ChartSkeletonProps) {
  return (
    <Skeleton
      type='graph'
      className={`${ChartClasses[type].container} ${className}`}
    />
  );
}
