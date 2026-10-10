'use client';

import Game from '@ts/games/game';
import { MetricCoreProps } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';

import Skeleton from '@components/Skeleton';
import GameCollage from '@components/data-blocks/GameCollage';
import GameCollageSkeleton from '@components/data-blocks/GameCollageSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import MultipleRating from '@components/data-blocks/MultipleRatings';
import PropBlock from '@components/data-blocks/PropBlock';

import FetchMetric from '../../components/FetchMetric';

type TopGameProps = {
  game: Game;
  index: number;
};

type TopGameSkeletonProps = {
  parentKey: string;
  index: number;
};

const TOP_GAMES_SKELETONS = 12;

/**
 * @param params - Search params with user id.
 * @returns Top games by rating or error data.
 */
const fetchTopGames = async (params: {
  userId: string;
}): Promise<MetricResponse<Game[]>> => {
  const gamesIds = await getMetricClient<Game[]>(
    '/api/games/titles/rating',
    params
  );

  return {
    error: gamesIds.error,
    data: gamesIds.data
  };
};

/**
 * @param props
 * @param props.game - Full game data.
 * @param props.index - Index of game in sorted array.
 * @returns Data block with game data and ratings from critics, IGDB users and My Stats user.
 */
function TopGame({ game, index }: TopGameProps) {
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
            ? game.publishers.map((pub) => pub.name).join(', ')
            : '—'}
        </PropBlock>
      </div>

      <MultipleRating
        className='data-block__pre-rank-prop'
        userOwnRating={game.rating}
        usersRating={game.usersRating}
        criticsRating={game.criticsRating}
      />

      <div className='data-block__rank'>{index + 1}</div>
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
      </div>

      <MultipleRating className='data-block__pre-rank-prop' />
      <div className='data-block__rank'>{index + 1}</div>
    </div>
  );
}

export function GamesRatingsSkeleton() {
  return (
    <div className='top-rated-games'>
      {Array.from({ length: TOP_GAMES_SKELETONS }).map((_, i) => (
        <TopGameSkeleton
          key={`data-block--top-game-skeleton-${i}`}
          parentKey={`data-block--top-game-skeleton-${i}`}
          index={i}
        />
      ))}
    </div>
  );
}

/**
 * @param props
 * @param props.userId - User whose metrics will be fetched.
 * @returns Metric component of top games by user's rating.
 */
export default function GamesRatings({ userId }: MetricCoreProps) {
  return (
    <MetricWrapper id='games-rating'>
      <FetchMetric
        fetchMetricData={fetchTopGames}
        metric={(data) => (
          <div className='top-rated-games'>
            {data.map((game, i) => (
              <TopGame key={`${game.id}-rating`} game={game} index={i} />
            ))}
          </div>
        )}
        fallback={<GamesRatingsSkeleton />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
