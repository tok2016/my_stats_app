'use client';

import Pagination from '@components/Pagination';

type GamesTablePaginationProps = {
  pagesCount: number;
  currentPage: number;
  startIndex: number;
  gamesCount: number;
};

/**
 * @param props
 * @param props.currentPage - Current list page.
 * @param props.pagesCount - Pages count of list.
 * @param props.startIndex - Global index of first games from given array.
 * @param props.gameCount - Given filtered games count.
 * @returns Games list pagination with thier global index range.
 */
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
