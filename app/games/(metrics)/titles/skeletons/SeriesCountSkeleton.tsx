import Skeleton from '@components/Skeleton';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import GamePropBlock from '../components/GamePropBlock';
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

      <GamePropBlock title='Best game'>
        <Skeleton fontSize='min' lineHeight='wide' />
      </GamePropBlock>

      <div className='data-block-grid'>
        <GamePropBlock title='Developers'>
          <Skeleton fontSize='min' lineHeight='wide' rows={2} />
        </GamePropBlock>

        <GamePropBlock title='Publishers'>
          <Skeleton fontSize='min' lineHeight='wide' rows={2} />
        </GamePropBlock>

        <GamePropBlock title='Games'>
          <Skeleton fontSize='min' />
        </GamePropBlock>

        <GamePropBlock title='Playtime'>
          <Skeleton fontSize='min' />
        </GamePropBlock>
      </div>

      <MultipleRating />
    </div>
  );
}

export default function SeriesCountSkeleton() {
  return (
    <div className='top-series'>
      {Array.from({ length: MAX_SERIES_SKELETONS }).map((_, i) => (
        <TopSeriesSkeleton
          key={`top-series-skeleton-${i}`}
          parentKey={`top-series-skeleton-${i}`}
        />
      ))}
    </div>
  );
}
