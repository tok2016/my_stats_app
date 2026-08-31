import { GameDetailed } from '@ts/games/game';

import { getMetricData } from '@lib/server-actions';

import EmptyMetric from '@components/data-blocks/EmptyMetric';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import RecommendedGameBlock from '@app/games/components/RecommendedGameBlock';

import GameButtons from './components/GameButtons';
import GameDetails from './components/GameDetials';
import GameRatings from './components/GameRatings';

export default async function GameInfoPage({
  params
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const game = await getMetricData<GameDetailed | null>(
    `/api/games/titles/item/${gameId}`,
    null
  );

  if (!game) {
    return <EmptyMetric message='Game was not found' />;
  }

  return (
    <>
      <div className='games-page-name'>
        <h2>{game.name}</h2>
        <GameButtons game={game} />
      </div>

      <div className='game-page-content'>
        <GameDetails game={game} />
        <GameRatings game={game} />
        <MetricWrapper id='similar-games' title='Similar games'>
          <div className='recommended-games'>
            {game.similarGames.map((similarGame) => (
              <RecommendedGameBlock key={similarGame.id} {...similarGame} />
            ))}
          </div>
        </MetricWrapper>
      </div>
    </>
  );
}
