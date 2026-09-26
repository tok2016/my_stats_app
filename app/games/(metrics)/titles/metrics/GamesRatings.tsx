'use client';

import Game from '@ts/games/game';
import { CoreMetricProps } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

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
 * @param games - All user's games.
 * @returns Funtion to fetch top games by rating.
 */
const fetchTopGames =
  (games: ObjectMapArray<Game, 'id'>) =>
  /**
   * @param params - Search params with user id.
   * @returns Top games by rating or error data.
   */
  async (params: { userId: string }): Promise<MetricResponse<Game[]>> => {
    const gamesIds = await getMetricClient<string[]>(
      '/api/games/titles/rating',
      params
    );

    return {
      error: gamesIds.error,
      data: gamesIds.data
        ?.map((id) => games.findByKey(id))
        .filter((game) => !!game)
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
            ? game.publishers.map((pub) => pub.name).join(', ')
            : '—'}
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

function TopGameSkeleton({ parentKey, index }: TopGameSkeletonProps) {
  return (
    <div className='data-block top-game'>
      <Skeleton type='h4' />
      <GameCollageSkeleton parentKey={parentKey} />

      <div className='data-block-grid min'>
        <PropBlock title='Developer'>
          <Skeleton lineHeight='wide' rows={2} />
        </PropBlock>

        <PropBlock title='Publisher'>
          <Skeleton lineHeight='wide' rows={2} />
        </PropBlock>
      </div>

      <MultipleRating className='pre-rank-prop' />
      <div className='data-block-rank'>{index + 1}</div>
    </div>
  );
}

export function GamesRatingsSkeleton() {
  return (
    <div className='top-games-grid'>
      {Array.from({ length: TOP_GAMES_SKELETONS }).map((_, i) => (
        <TopGameSkeleton
          key={`top-game-skeleton-${i}`}
          parentKey={`top-game-skeleton-${i}`}
          index={i}
        />
      ))}
    </div>
  );
}

/**
 * @param props
 * @param props.games - Games of user.
 * @param props.userId - User whose metrics will be fetched.
 * @returns Metric component of top games by user's rating.
 */
export default function GamesRatings({ games, userId }: CoreMetricProps) {
  return (
    <MetricWrapper id='games-rating'>
      <FetchMetric
        fetchMetricData={fetchTopGames(games)}
        metric={(data) => (
          <div className='top-games-grid'>
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
