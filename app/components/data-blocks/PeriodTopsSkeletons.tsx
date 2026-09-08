import { MetricId } from '@ts/games/metric';

import {
  DEFAULT_PERIOD_BLOCKS_GAP,
  DEFAULT_PERIOD_BLOCK_WIDTH
} from '@lib/utils';

import Divider from '@components/Divider';
import Skeleton from '@components/Skeleton';
import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import { ChartClasses } from '@components/charts/chart-styles';

type PeriodTopsSkeletonsProps = {
  metricId: MetricId;
  blockWidthRem?: number;
  gapRem?: number;
  periodTopClassName?: string;
  barClassName?: string;
  showBar?: boolean;
};

const SKELETONS_COUNT = 10;

type PeriodTopSkeletonProps = {
  blockWidthRem?: number;
  className?: string;
};

function PeriodTopSkeleton({
  className,
  blockWidthRem = DEFAULT_PERIOD_BLOCK_WIDTH
}: PeriodTopSkeletonProps) {
  return (
    <div
      className={`data-block period-top ${className}`}
      style={{ width: `${blockWidthRem}rem` }}
    >
      <Skeleton
        type='text'
        className='data-block-title'
        fontSize='regular'
        lineHeight='wide'
      />
      <ol className='data-block-list'>
        <li>
          <Skeleton
            className='data-block-item'
            type='text'
            fontSize='small'
            lineHeight='wide'
          />
        </li>
        <li>
          <Skeleton
            className='data-block-item'
            type='text'
            fontSize='small'
            lineHeight='wide'
          />
        </li>
        <li>
          <Skeleton
            className='data-block-item'
            type='text'
            fontSize='small'
            lineHeight='wide'
          />
        </li>
      </ol>
    </div>
  );
}

export default function PeriodTopsSkeletons({
  metricId,
  blockWidthRem = DEFAULT_PERIOD_BLOCK_WIDTH,
  gapRem = DEFAULT_PERIOD_BLOCKS_GAP,
  periodTopClassName = '',
  showBar,
  barClassName = ''
}: PeriodTopsSkeletonsProps) {
  return (
    <>
      <div className='period-tops'>
        <div className='period-tops-in-group' style={{ gap: `${gapRem}rem` }}>
          {Array.from({ length: SKELETONS_COUNT }, (_v, k) => (
            <PeriodTopSkeleton
              key={`${metricId}-${k}`}
              className={periodTopClassName}
              blockWidthRem={blockWidthRem}
            />
          ))}
        </div>
        <div className='years'>
          <Divider rounded className='invisible'>
            0
          </Divider>
        </div>
      </div>

      {showBar && (
        <ChartSkeleton
          type='periodBar'
          className={`${ChartClasses.periodBar.container} ${barClassName}`}
        />
      )}
    </>
  );
}
