import { SearchGame } from '@ts/games/game';

import { tryGetDataAuthorized } from '@lib/server-actions';

import GameRatingForm from './components/GameRatingForm';
import SearchGameForm from './components/SearchGameForm';

type AddGameParams = {
  gameId?: string;
};

/**
 * @param props
 * @param props.searchParams - Search params with IGDB ID of choosen game.
 * @returns Form to browse a game from IGDB. If game id is given, returns form to add personal info about the game.
 */
export default async function AddGamePage({
  searchParams
}: {
  searchParams: Promise<AddGameParams>;
}) {
  const { gameId } = await searchParams;

  try {
    const game = await tryGetDataAuthorized<SearchGame>(
      `/api/games/search/${gameId}`
    );
    return <GameRatingForm game={game} />;
  } catch {
    return <SearchGameForm />;
  }
}
