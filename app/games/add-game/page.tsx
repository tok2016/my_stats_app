import { SearchGame } from '@ts/games/game';

import { getMetricData } from '@lib/server-actions';

import GameRatingForm from './components/GameRatingForm';
import SearchGameForm from './components/SearchGameForm';

type AddGameParams = {
  gameId?: string;
};

export default async function AddGamePage({
  searchParams
}: {
  searchParams: AddGameParams;
}) {
  const { gameId } = await searchParams;
  const game = gameId
    ? await getMetricData<SearchGame | null>(
        `/api/games/search/${gameId}`,
        null
      )
    : undefined;

  if (!game) return <SearchGameForm />;

  return <GameRatingForm game={game} />;
}
