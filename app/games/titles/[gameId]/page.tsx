import { GameDetailed } from '@ts/games/game';

import { tryGetDataAuthorized } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';

import RecommendedGameBlock from '@app/games/components/RecommendedGameBlock';

import GameControlButtons from './components/GameControlButtons';
import GameDetails from './components/GameDetials';
import GameRatings from './components/GameRatings';

/**
 * @param props
 * @param props.params - Route params with game id.
 * @returns Page of game of given id.
 */
export default async function GameInfoPage({
  params
}: {
  params: Promise<{ gameId: string }>;
}) {
  try {
    const { gameId } = await params;
    const game = await tryGetDataAuthorized<GameDetailed>(
      `/api/games/titles/item/${gameId}`
    );

    return (
      <>
        <div className='games__page-name'>
          <h2>{game.name}</h2>
          <GameControlButtons game={game} />
        </div>

        <div className='game-title-page'>
          <GameDetails game={game} />
          <GameRatings game={game} />
          <div className='metric game-title-page__similar'>
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
