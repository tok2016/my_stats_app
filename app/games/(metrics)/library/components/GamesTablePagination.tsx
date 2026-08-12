'use client';

import Pagination from '@components/Pagination';

type GamesTablePaginationProps = {
  pagesCount: number;
  currentPage: number;
  startIndex: number;
  gamesCount: number;
};

export default function GamesTablePagination({
  currentPage,
  pagesCount,
  startIndex,
  gamesCount
}: GamesTablePaginationProps) {
  return (
    <div className='table-pagination'>
      {!gamesCount || !currentPage ? (
        <span className='bold'>No game was found</span>
      ) : (
        <span className='bold'>
          {startIndex + 1} — {startIndex + gamesCount} games
        </span>
      )}

      <Pagination current={currentPage} pages={pagesCount} />
    </div>
  );
}
