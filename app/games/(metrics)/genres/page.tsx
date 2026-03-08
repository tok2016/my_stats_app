import Game from '@ts/games/game';

import { getGamesMap, getItemsMap } from '@app/games/lib/actions';

const isIgdbGenre = (value: unknown): value is Game['genres'][number] =>
  typeof (value as Game['genres'][number])?.name !== 'undefined';

export default async function GamesGenres() {
  const gamesMap = await getGamesMap();
  const genresMap = await getItemsMap<Game['genres'][number]>(
    gamesMap,
    'genres',
    isIgdbGenre
  );
}
