import { VectorMap } from '@south-paw/react-vector-maps';

import { CustomChartType } from '@ts/ui/charts-data';

import Skeleton from '@components/Skeleton';

import { ChartClasses } from './chart-styles';
import WorldData from './world-low-res.json';

type ChartSkeletonProps = {
  className?: string;
  type: CustomChartType;
};

export function ChartSkeleton({ className, type }: ChartSkeletonProps) {
  if (type === 'map')
    return (
      <div className={`chart ${ChartClasses[type].container}`}>
        <div className='chart-legend-content'>
          <div className='chart-core-wrapper'>
            <div className={ChartClasses[type].core}>
              <VectorMap
                className='map'
                {...WorldData}
                layerProps={{
                  strokeWidth: 0.5
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <Skeleton
      type='graph'
      className={`${ChartClasses[type].container} ${className}`}
    />
  );
}
