import { GamesFilter } from '@ts/games/filter';
import { GameTableData, GamesTablePage } from '@ts/games/game';

import { getMetricData } from '@lib/server-actions';

import GamesFilterMenu from './GamesFilterMenu';
import GamesTable from './GamesTable';
import GamesTablePagination from './GamesTablePagination';

const GAMES_PAGE_LIMIT = 20;

export default async function GamesLibrary({
  filters
}: {
  filters: GamesFilter;
}) {
  const urlParams = new URLSearchParams({
    ...filters,
    limit: GAMES_PAGE_LIMIT.toString()
  });

  const gamesPage = await getMetricData<GamesTablePage>(
    `/api/games?${urlParams.toString()}`,
    {
      games: [],
      startIndex: 0,
      pagesCount: 0,
      currentPage: 0,
      maxHours: 1000
    }
  );

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
}
