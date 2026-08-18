import Game from '@ts/games/game';

import { getMetricData } from '@lib/server-actions';

import EmptyMetric from '@components/data-blocks/EmptyMetric';
import GameCollage from '@components/data-blocks/GameCollage';
import { LinksString } from '@components/data-blocks/LinksString';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import PropBlock from '../../../../components/data-blocks/PropBlock';

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
        <PropBlock title='Developer'>
          {game.developers.length ? (
            <LinksString
              baseEndpoint='/games/studios'
              items={game.developers}
              groupKey={`rated-game-developer-${game.id}`}
            />
          ) : (
            <span>—</span>
          )}
        </PropBlock>

        <PropBlock title='Publisher'>
          {game.publishers.length ? (
            <LinksString
              baseEndpoint='/games/studios'
              items={game.publishers}
              groupKey={`rated-game-publisher-${game.id}`}
            />
          ) : (
            <span>—</span>
          )}
        </PropBlock>
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

  if (!gamesIds.length)
    return <EmptyMetric message={`You haven't rated any game yet`} />;

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
