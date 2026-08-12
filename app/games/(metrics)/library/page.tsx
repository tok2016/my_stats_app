import { GamesFilter } from '@ts/games/filter';
import { GameTableData, GamesTablePage } from '@ts/games/game';

import { getMetricData } from '@lib/server-actions';

import GamesFilterMenu from './components/GamesFilterMenu';
import GamesTable from './components/GamesTable';
import GamesTablePagination from './components/GamesTablePagination';

export default async function GameLibraryPage({
  searchParams
}: {
  searchParams: Promise<GamesFilter>;
}) {
  const awaitedParams = await searchParams;
  const urlParams = new URLSearchParams({ ...awaitedParams });
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
    <div className='library'>
      <GamesFilterMenu maxHours={gamesPage.maxHours} filters={awaitedParams} />

      <GamesTable
        games={gamesTableData}
        sortField={awaitedParams.sort}
        sortDirection={awaitedParams.direction}
      />

      <GamesTablePagination
        currentPage={gamesPage.currentPage}
        pagesCount={gamesPage.pagesCount}
        startIndex={gamesPage.startIndex}
        gamesCount={gamesTableData.length}
      />
    </div>
  );
}
