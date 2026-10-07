import { VectorMap } from '@south-paw/react-vector-maps';

import { CustomChartType } from '@ts/ui/charts-data';

import Skeleton from '@components/Skeleton';

import { ChartClasses } from './chart-styles';
import WorldData from './world-low-res.json';

type ChartSkeletonProps = {
  className?: string;
  type: CustomChartType;
};

/**
 * @param props
 * @param props.className
 * @param props.type - Chart type.
 * @returns Skeleton for every chart type.
 */
export function ChartSkeleton({ className, type }: ChartSkeletonProps) {
  if (type === 'map')
    return (
      <div className={`chart ${ChartClasses[type].container} ${className}`}>
        <div className='chart__core-legend-container'>
          <div className='chart__core-legend-container__core'>
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
