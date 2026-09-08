import { GameDetailed } from '@ts/games/game';

import { getData } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';

import RecommendedGameBlock from '@app/games/components/RecommendedGameBlock';

import GameButtons from './components/GameButtons';
import GameDetails from './components/GameDetials';
import GameRatings from './components/GameRatings';

export default async function GameInfoPage({
  params
}: {
  params: Promise<{ gameId: string }>;
}) {
  try {
    const { gameId } = await params;
    const game = await getData<GameDetailed>(
      `/api/games/titles/item/${gameId}`
    );

    return (
      <>
        <div className='games-page-name'>
          <h2>{game.name}</h2>
          <GameButtons game={game} />
        </div>

        <div className='game-page-content'>
          <GameDetails game={game} />
          <GameRatings game={game} />
          <div className='metric similar-games'>
            <h3>Similar games</h3>
            <div className='recommended-games'>
              {game.similarGames.map((similarGame) => (
                <RecommendedGameBlock key={similarGame.id} {...similarGame} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  } catch (err) {
    return <ErrorMessage error={err} className='stretch-error' />;
  }
}
