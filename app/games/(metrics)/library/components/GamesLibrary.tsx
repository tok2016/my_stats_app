import { GamesFilter } from '@ts/games/filter';
import { GameTableData } from '@ts/games/game';

import { tryGetCurrentUser, tryGetGames } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';

import GamesFilterMenu from './GamesFilterMenu';
import GamesTable from './GamesTable';
import GamesTablePagination from './GamesTablePagination';

const GAMES_PAGE_LIMIT = 20;

/**
 * @param props
 * @param props.filters - Filters from search params.
 * @returns List of all user's games, filtered by given filters, divided into pages.
 */
export default async function GamesLibrary({
  filters
}: {
  filters: GamesFilter;
}) {
  try {
    //Searches games by given filters.
    const user = await tryGetCurrentUser();
    const gamesPage = await tryGetGames({
      ...filters,
      limit: GAMES_PAGE_LIMIT.toString(),
      userId: user.id
    });

    //Starts indexation with global index of first game in given array.
    const gamesTableData: GameTableData[] = gamesPage.games.map((game, i) => ({
      ...game,
      index: gamesPage.startIndex + i
    }));

    return (
      <>
        <GamesFilterMenu maxHours={gamesPage.maxHours} filters={filters} />

        <GamesTable
          games={gamesTableData}
          sortField={filters.sort}
          sortDirection={filters.direction}
        />

        <GamesTablePagination
          currentPage={gamesPage.currentPage}
          pagesCount={gamesPage.pagesCount}
          startIndex={gamesPage.startIndex}
          gamesCount={gamesTableData.length}
        />
      </>
    );
  } catch (err) {
    return <ErrorMessage error={err} className='stretch-error' />;
  }
}
