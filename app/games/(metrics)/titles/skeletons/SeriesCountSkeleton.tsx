import Skeleton from '@components/Skeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import PropBlock from '../../../../components/data-blocks/PropBlock';
import { MAX_GAMES_IN_SERIES } from '../utils';

type TopSeriesSkeletonProps = {
  parentKey: string;
};

const MAX_SERIES_SKELETONS = 5;

function TopSeriesSkeleton({ parentKey }: TopSeriesSkeletonProps) {
  return (
    <div className='data-block series-block'>
      <Skeleton type='h4' />

      <div className='series-games-collage'>
        {Array.from({ length: MAX_GAMES_IN_SERIES }).map((_, i) => (
          <Skeleton
            key={`${parentKey}-series-game-cover-skeleton-${i}`}
            type='image'
            className={`game-cover series-game-${i}`}
          />
        ))}
      </div>

      <PropBlock title='Best game' className='min'>
        <Skeleton lineHeight='wide' />
      </PropBlock>

      <div className='data-block-grid min'>
        <PropBlock title='Developers'>
          <Skeleton lineHeight='wide' rows={2} />
        </PropBlock>

        <PropBlock title='Publishers'>
          <Skeleton lineHeight='wide' rows={2} />
        </PropBlock>

        <PropBlock title='Games'>
          <Skeleton />
        </PropBlock>

        <PropBlock title='Playtime'>
          <Skeleton />
        </PropBlock>
      </div>

      <MultipleRating />
    </div>
  );
}

export default function SeriesCountSkeleton() {
  return (
    <MetricWrapper id='top-series'>
      <div className='top-series'>
        {Array.from({ length: MAX_SERIES_SKELETONS }).map((_, i) => (
          <TopSeriesSkeleton
            key={`top-series-skeleton-${i}`}
            parentKey={`top-series-skeleton-${i}`}
          />
        ))}
      </div>
    </MetricWrapper>
  );
}
