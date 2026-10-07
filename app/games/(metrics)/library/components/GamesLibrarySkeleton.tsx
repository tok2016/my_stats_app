import Skeleton from '@components/Skeleton';

import GamesFilterMenu from './GamesFilterMenu';

const GAMES_TABLE_SKELETON_ROWS = 20;

export default function GamesLibrarySkeleton() {
  return (
    <>
      <GamesFilterMenu maxHours={0} filters={{}} disabled />

      <div className='library__games-table-wrapper'>
        <Skeleton
          className='library__games-table-wrapper__table'
          type='tablet'
          unitClassName='game-row-skeleton'
          rows={GAMES_TABLE_SKELETON_ROWS}
        />
      </div>

      <div className='library__pagination'>
        <Skeleton width='8rem' />
        <Skeleton width='8rem' />
      </div>
    </>
  );
}
