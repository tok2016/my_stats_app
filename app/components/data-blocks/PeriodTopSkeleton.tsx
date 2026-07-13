import Skeleton from '@components/Skeleton';

type PeriodTopSkeletonProps = {
  className?: string;
};

export default function PeriodTopSkeleton({
  className
}: PeriodTopSkeletonProps) {
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
