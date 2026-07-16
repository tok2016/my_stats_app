import Skeleton from '@components/Skeleton';

type PeriodTopsSkeletonsProps = {
  metricId: string;
  periodTopClassName?: string;
};

const SKELETONS_COUNT = 10;

type PeriodTopSkeletonProps = {
  className?: string;
};

function PeriodTopSkeleton({ className }: PeriodTopSkeletonProps) {
  return (
    <div className={`data-block period-top ${className}`}>
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
  periodTopClassName
}: PeriodTopsSkeletonsProps) {
  return (
    <div className='period-tops-in-group'>
      {Array.from({ length: SKELETONS_COUNT }, (_v, k) => (
        <PeriodTopSkeleton
          key={`${metricId}-${k}`}
          className={periodTopClassName}
        />
      ))}
    </div>
  );
}
