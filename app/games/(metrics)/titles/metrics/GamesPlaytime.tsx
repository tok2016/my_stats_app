import Link from 'next/link';

import Game from '@ts/games/game';

import { getMetricData } from '@lib/server-actions';

import GameCollage from '@components/data-blocks/GameCollage';

import GamesPlaytimeTable from '../charts/GamesPlaytimeTable';
import GamePropBlock from '../components/GamePropBlock';
import { GameStudiosLinks } from '../components/GameStudiosLinks';
import { GamesPlaytimeTableData } from '../types';
import { SPECIAL_GAMES_COUNT } from '../utils';

type GamesPlaytimeProps = {
  gamesMap: Map<string, Game>;
};

type TopGameBlockProps = {
  game: GamesPlaytimeTableData;
};

function TopGameBlock({ game }: TopGameBlockProps) {
  return (
    <div className='data-block top-game'>
      <h4 className='colored'>{game.name}</h4>
      <GameCollage game={game} />
      <div className='data-block-grid min'>
        <GamePropBlock title='Developer'>
          <GameStudiosLinks
            studios={game.developers}
            groupKey={`game-time-developer-${game.id}`}
          />
        </GamePropBlock>

        <GamePropBlock title='Publisher'>
          <GameStudiosLinks
            studios={game.publishers}
            groupKey={`game-time-publisher-${game.id}`}
          />
        </GamePropBlock>

        <GamePropBlock title='Platform'>
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
        </GamePropBlock>

        <GamePropBlock title='Playtime'>
          <span className='bold colored'>{game.hours} h.</span>
        </GamePropBlock>
      </div>

      <div className='data-block-rank'>{game.index + 1}</div>
    </div>
  );
}

export default async function GamesPlaytime({ gamesMap }: GamesPlaytimeProps) {
  const gamesIds = await getMetricData<string[]>(
    '/api/games/titles/playtime',
    []
  );

  const topGames = gamesIds
    .map((id, i) => {
      const game = gamesMap.get(id);
      if (!game) return;

      const data: GamesPlaytimeTableData = {
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
