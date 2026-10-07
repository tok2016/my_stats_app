'use client';

import Game, { GameTableData } from '@ts/games/game';
import { CoreMetricProps } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import Skeleton from '@components/Skeleton';
import GameCollage from '@components/data-blocks/GameCollage';
import GameCollageSkeleton from '@components/data-blocks/GameCollageSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import PropBlock from '@components/data-blocks/PropBlock';

import FetchMetric from '../../components/FetchMetric';
import { SPECIAL_GAMES_COUNT } from '../../utils';
import GamesPlaytimeTable from '../charts/GamesPlaytimeTable';

type TopGameBlockProps = {
  game: GameTableData;
};

type TopGameSkeletonProps = {
  parentKey: string;
  index: number;
};

const PLAYTIME_SKELETON_TABLE_ROWS = 7;

/**
 * @param games - All user's games.
 * @returns Funtion to fetch top games by playtime.
 */
const fetchGamePlaytime =
  (games: ObjectMapArray<Game, 'id'>) =>
  /**
   * @param params - Search params with user id.
   * @returns Top games by playtime or error data.
   */
  async (params: {
    userId: string;
  }): Promise<MetricResponse<GameTableData[]>> => {
    const gamesIds = await getMetricClient<string[]>(
      '/api/games/titles/playtime',
      params
    );

    return {
      error: gamesIds.error,
      data: gamesIds.data
        ?.map((id, i) => {
          const game = games.findByKey(id);
          if (!game) return;

          const data: GameTableData = {
            ...game,
            index: i
          };

          return data;
        })
        .filter((game) => !!game)
    };
  };

/**
 * @param props
 * @param props.game - Full game data.
 * @returns Block with game data.
 */
function TopGameBlock({ game }: TopGameBlockProps) {
  return (
    <div className='data-block data-block--top-game'>
      <h4 className='colored'>{game.name}</h4>

      <GameCollage game={game} />

      <div className='data-block__props-grid min'>
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

      <div className='data-block__rank'>{game.index + 1}</div>
    </div>
  );
}

function TopGameSkeleton({ parentKey, index }: TopGameSkeletonProps) {
  return (
    <div className='data-block data-block--top-game'>
      <Skeleton type='h4' />
      <GameCollageSkeleton parentKey={parentKey} />

      <div className='data-block__props-grid min'>
        <PropBlock title='Developer'>
          <Skeleton lineHeight='wide' rows={2} />
        </PropBlock>

        <PropBlock title='Publisher'>
          <Skeleton lineHeight='wide' rows={2} />
        </PropBlock>

        <PropBlock title='Platform'>
          <Skeleton lineHeight='wide' />
        </PropBlock>

        <PropBlock title='Playtime'>
          <Skeleton lineHeight='wide' />
        </PropBlock>
      </div>

      <div className='data-block__rank'>{index + 1}</div>
    </div>
  );
}

export function GamesPlaytimeSkeleton() {
  return (
    <div className='games-playtime'>
      <div className='games-playtime__top-games'>
        {Array.from({ length: SPECIAL_GAMES_COUNT }).map((_, i) => (
          <TopGameSkeleton
            key={`game-playtime-skeleton-${i}`}
            parentKey={`game-playtime-skeleton-${i}`}
            index={i}
          />
        ))}
      </div>

      <Skeleton
        type='tablet'
        unitClassName='game-row-skeleton'
        rows={PLAYTIME_SKELETON_TABLE_ROWS}
      />
    </div>
  );
}

/**
 * Visualizes top-3 games with separated blocks and the rest ones with table.
 * @param props
 * @param props.games - Games of user.
 * @param props.userId - User whose metrics will be fetched.
 * @returns Metric of top games by playtime.
 */
export default function GamesPlaytime({ games, userId }: CoreMetricProps) {
  return (
    <MetricWrapper id='games-playtime'>
      <FetchMetric
        fetchMetricData={fetchGamePlaytime(games)}
        metric={(data) => (
          <div className='games-playtime'>
            <div className='games-playtime__top-games'>
              {data.slice(0, SPECIAL_GAMES_COUNT).map((game) => (
                <TopGameBlock game={game} key={`${game.id}-playtime`} />
              ))}
            </div>

            <GamesPlaytimeTable data={data.slice(SPECIAL_GAMES_COUNT)} />
          </div>
        )}
        fallback={<GamesPlaytimeSkeleton />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
