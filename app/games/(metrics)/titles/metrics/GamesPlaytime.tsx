import Link from 'next/link';

import Game, { GameTableData } from '@ts/games/game';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import GameCollage from '@components/data-blocks/GameCollage';
import { LinksString } from '@components/data-blocks/LinksString';

import PropBlock from '../../../../components/data-blocks/PropBlock';
import GamesPlaytimeTable from '../charts/GamesPlaytimeTable';
import { SPECIAL_GAMES_COUNT } from '../utils';

type GamesPlaytimeProps = {
  games: ObjectMapArray<Game, 'id'>;
};

type TopGameBlockProps = {
  game: GameTableData;
};

function TopGameBlock({ game }: TopGameBlockProps) {
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
              groupKey={`game-time-developer-${game.id}`}
            />
          ) : (
            <span>—</span>
          )}
        </PropBlock>

        <PropBlock title='Publisher'>
          {game.publishers ? (
            <LinksString
              baseEndpoint='/games/studios'
              items={game.publishers}
              groupKey={`game-time-publisher-${game.id}`}
            />
          ) : (
            <span>—</span>
          )}
        </PropBlock>

        <PropBlock title='Platform'>
          {game.platform ? (
            <Link
              href={`/games/platforms/${game.platform.id}`}
              className='underline'
            >
              {game.platform.name}
            </Link>
          ) : (
            <span>—</span>
          )}
        </PropBlock>

        <PropBlock title='Playtime'>
          <span className='bold colored'>{game.hours} h.</span>
        </PropBlock>
      </div>

      <div className='data-block-rank'>{game.index + 1}</div>
    </div>
  );
}

export default async function GamesPlaytime({ games }: GamesPlaytimeProps) {
  const gamesIds = await getMetricData<string[]>(
    '/api/games/titles/playtime',
    []
  );

  const topGames = gamesIds
    .map((id, i) => {
      const game = games.findByKey(id);
      if (!game) return;

      const data: GameTableData = {
        ...game,
        index: i
      };

      return data;
    })
    .filter((game) => !!game);

  return (
    <div className='games-playtime'>
      <div className='top-3-games'>
        {topGames.slice(0, SPECIAL_GAMES_COUNT).map((game) => (
          <TopGameBlock game={game} key={`${game.id}-playtime`} />
        ))}
      </div>

      <GamesPlaytimeTable data={topGames.slice(SPECIAL_GAMES_COUNT)} />
    </div>
  );
}
