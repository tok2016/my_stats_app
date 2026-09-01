import { Suspense } from 'react';

import { GameTableData } from '@ts/games/game';
import { MetricContentProps } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import GameCollage from '@components/data-blocks/GameCollage';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import PropBlock from '../../../../components/data-blocks/PropBlock';
import GamesPlaytimeTable from '../charts/GamesPlaytimeTable';
import GamesPlaytimeSkeleton from '../skeletons/GamesPlaytimeSkeleton';
import { SPECIAL_GAMES_COUNT } from '../utils';

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
          {game.developers.length
            ? game.developers.map((dev) => dev.name).join(', ')
            : '—'}
        </PropBlock>

        <PropBlock title='Publisher'>
          {game.publishers.length
            ? game.publishers.map((dev) => dev.name).join(', ')
            : '—'}
        </PropBlock>

        <PropBlock title='Platform'>
          {game.platform ? game.platform.name : '—'}
        </PropBlock>

        <PropBlock title='Playtime'>
          <span className='bold colored'>{game.hours} h.</span>
        </PropBlock>
      </div>

      <div className='data-block-rank'>{game.index + 1}</div>
    </div>
  );
}

async function TopGamesPlaytime({
  metricId,
  games,
  userId
}: MetricContentProps) {
  const gamesIds = await getMetricData<string[]>(
    '/api/games/titles/playtime',
    [],
    userId
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
    <MetricWrapper id={metricId}>
      <div className='games-playtime'>
        <div className='top-3-games'>
          {topGames.slice(0, SPECIAL_GAMES_COUNT).map((game) => (
            <TopGameBlock game={game} key={`${game.id}-playtime`} />
          ))}
        </div>

        <GamesPlaytimeTable data={topGames.slice(SPECIAL_GAMES_COUNT)} />
      </div>
    </MetricWrapper>
  );
}

export default function GamesPlaytime(props: MetricContentProps) {
  return (
    <Suspense fallback={<GamesPlaytimeSkeleton />}>
      <TopGamesPlaytime {...props} />
    </Suspense>
  );
}
