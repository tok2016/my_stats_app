import Game from '@ts/games/game';

import { getMetricData } from '@lib/server-actions';

import GameCollage from '@components/data-blocks/GameCollage';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import GamePropBlock from '../components/GamePropBlock';
import { GameStudiosLinks } from '../components/GameStudiosLinks';

type HighestRatedGamesProps = {
  gamesMap: Map<string, Game>;
};

type TopGameProps = {
  game: Game;
  index: number;
};

function TopGame({ game, index }: TopGameProps) {
  return (
    <div className='data-block top-game'>
      <h4 className='colored'>{game.name}</h4>
      <GameCollage game={game} />

      <div className='data-block-grid min'>
        <GamePropBlock title='Developer'>
          <GameStudiosLinks
            studios={game.developers}
            groupKey={`rated-game-developer-${game.id}`}
          />
        </GamePropBlock>

        <GamePropBlock title='Publisher'>
          <GameStudiosLinks
            studios={game.publishers}
            groupKey={`rated-game-publisher-${game.id}`}
          />
        </GamePropBlock>
      </div>

      <MultipleRating
        className='pre-rank-prop'
        userOwnRating={game.rating}
        usersRating={game.usersRating}
        criticsRating={game.criticsRating}
      />

      <div className='data-block-rank'>{index + 1}</div>
    </div>
  );
}

export default async function HighestRatedGames({
  gamesMap
}: HighestRatedGamesProps) {
  const gamesIds = await getMetricData<string[]>(
    '/api/games/titles/rating',
    []
  );
  const topGames = gamesIds
    .map((id) => gamesMap.get(id))
    .filter((game) => !!game);

  return (
    <div className='top-games-grid'>
      {topGames.map((game, i) => (
        <TopGame key={`${game.id}-rating`} game={game} index={i} />
      ))}
    </div>
  );
}
