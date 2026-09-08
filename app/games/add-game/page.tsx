import { SearchGame } from '@ts/games/game';

import { getData } from '@lib/server-actions';

import GameRatingForm from './components/GameRatingForm';
import SearchGameForm from './components/SearchGameForm';

type AddGameParams = {
  gameId?: string;
};

export default async function AddGamePage({
  searchParams
}: {
  searchParams: Promise<AddGameParams>;
}) {
  const { gameId } = await searchParams;

  try {
    const game = await getData<SearchGame>(`/api/games/search/${gameId}`);
    return <GameRatingForm game={game} />;
  } catch {
    return <SearchGameForm />;
  }
}
