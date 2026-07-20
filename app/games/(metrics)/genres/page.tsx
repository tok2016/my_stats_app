import Game from '@ts/games/game';

import { getGamesMap, getItemsMap } from '@app/games/lib/actions';

import gamesData from '../../../../mock data/games.json';
import './genres-metrics.scss';
import GenreTops from './metrics/GenreTops';
import GenresCount from './metrics/GenresCount';
import GenresPeriodTops from './metrics/GenresPeriodTops';
import GenresPlaytime from './metrics/GenresPlaytime';
import HighestRatedGenres from './metrics/HighestRatedGenres';
import RecommendedGames from './metrics/RecommendedGames';

const isIgdbGenre = (value: unknown): value is Game['genres'][number] =>
  typeof (value as Game['genres'][number])?.name !== 'undefined';

export default async function GamesGenres() {
  //const gamesMap = await getGamesMap();
  const gamesMap = new Map<string, Game>(
    gamesData.map(
      (game) =>
        [
          game.id,
          {
            ...game,
            playDate: new Date(game.playDate),
            releasedAt: new Date(game.releasedAt)
          }
        ] as const
    )
  );
  const genresMap = await getItemsMap<Game['genres'][number]>(
    gamesMap,
    'genres',
    isIgdbGenre
  );

  console.log(genresMap);

  const seriesMap = new Map<
    number | string,
    Exclude<Game['series'], undefined>
  >();

  gamesMap.values().forEach((game) => {
    if (game.series && !seriesMap.get(game.series.id))
      seriesMap.set(game.series.id, game.series);
  });

  return (
    <>
      <div className='metrics-group'>
        <GenresCount genresMap={genresMap} seriesMap={seriesMap} />
        <GenresPlaytime genresMap={genresMap} />
      </div>

      <GenresPeriodTops genresMap={genresMap} />
      <GenreTops genresMap={genresMap} gamesMap={gamesMap} />
      <HighestRatedGenres genresMap={genresMap} />
      <RecommendedGames />
    </>
  );
}
