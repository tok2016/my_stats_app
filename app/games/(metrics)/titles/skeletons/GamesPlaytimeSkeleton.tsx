import Skeleton from '@components/Skeleton';
import GameCollageSkeleton from '@components/data-blocks/GameCollageSkeleton';

import PropBlock from '../../../../components/data-blocks/PropBlock';
import { SPECIAL_GAMES_COUNT } from '../utils';

type TopGameSkeletonProps = {
  parentKey: string;
  index: number;
};

const PLAYTIME_TABLE_ROWS = 7;

function TopGameSkeleton({ parentKey, index }: TopGameSkeletonProps) {
  return (
    <div className='data-block top-game'>
      <Skeleton type='h4' />
      <GameCollageSkeleton parentKey={parentKey} />
      <div className='data-block-grid min'>
        <PropBlock title='Developer'>
          <Skeleton fontSize='min' lineHeight='wide' rows={2} />
        </PropBlock>

        <PropBlock title='Publisher'>
          <Skeleton fontSize='min' lineHeight='wide' rows={2} />
        </PropBlock>

        <PropBlock title='Platform'>
          <Skeleton fontSize='min' lineHeight='wide' />
        </PropBlock>

        <PropBlock title='Playtime'>
          <Skeleton fontSize='min' lineHeight='wide' />
        </PropBlock>
      </div>

      <div className='data-block-rank'>{index + 1}</div>
    </div>
  );
}

export default function GamePlaytimeSkeleton() {
  return (
    <div className='games-playtime'>
      <div className='top-3-games'>
        {Array.from({ length: SPECIAL_GAMES_COUNT }).map((_, i) => (
          <TopGameSkeleton
            key={`game-playtime-skeleton-${i}`}
            parentKey={`game-playtime-skeleton-${i}`}
            index={i}
          />
        ))}
      </div>

      <Skeleton
        type='tablet'
        unitClassName='game-row-skeleton'
        rows={PLAYTIME_TABLE_ROWS}
      />
    </div>
  );
}
