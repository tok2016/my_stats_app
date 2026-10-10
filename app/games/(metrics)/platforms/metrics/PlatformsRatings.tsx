'use client';

import Game from '@ts/games/game';
import { MetricCoreProps } from '@ts/games/metric';
import { PlatformRatingData } from '@ts/games/platform';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';

import Rating from '@components/Rating';
import Skeleton from '@components/Skeleton';
import GameTitle from '@components/data-blocks/GameTitle';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';

type RatedPlatformProps = {
  ratedPlatform: PlatformRatingData;
  platform: Game['platform'];
  topGenre?: Game['genres'][number];
};

const MAX_PLATFORMS = 5;
const MAX_GAMES = 5;

/**
 * @param props
 * @param props.ratedPlatform - Platform data with rating, top games and genre.
 * @param props.platform - Full platform data.
 * @param props.topGenre - Full data about top genre.
 * @returns Data block with platform rating data.
 */
function RatedPlatform({
  ratedPlatform,
  platform,
  topGenre
}: RatedPlatformProps) {
  if (!platform) return;

  return (
    <div className='data-block data-block--rated-platform'>
      <div className='data-block__rating-title'>
        <Rating value={ratedPlatform.rating} />
        <h4 className='colored'>{platform.name}</h4>
      </div>

      <div className='small data-block__main-genre'>
        <span>Main genre: </span>
        {topGenre ? (
          <span className='colored bold'>{topGenre.name}</span>
        ) : (
          <span>none</span>
        )}
      </div>

      <span className='min'>Best games: </span>
      <div className='data-block__content'>
        {ratedPlatform.topGames.map((topGame) => (
          <div
            key={`${ratedPlatform.id}-${topGame.id}`}
            className='game-title-rating'
          >
            <GameTitle game={topGame} />
            <Rating value={topGame.rating} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlatformsRatingsSkeleton() {
  return (
    <div className='ratings-group'>
      {Array.from({ length: MAX_PLATFORMS }).map((_, i) => (
        <div
          className='data-block data-block--rated-platform'
          key={`rated-platform-skeleton-${i}`}
        >
          <Skeleton
            type='h4'
            unitClassName='data-block__rating-title-skeleton'
          />
          <Skeleton className='small data-block__main-genre' />
          <span className='min'>Best games: </span>
          <div className='data-block__content'>
            {Array.from({ length: MAX_GAMES }).map((_, j) => (
              <div
                key={`rated-platform-skeleton-${i}-game-${j}`}
                className='game-title'
              >
                <Skeleton
                  type='image'
                  className='game-cover game-title__cover'
                />
                <Skeleton className='game-title__name' />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * @param params - Search params with user id.
 * @returns Top platforms by average rating with top games and genre or error data.
 */
const fetchPlatformsRatings = async (params: {
  userId: string;
}): Promise<MetricResponse<PlatformRatingData[]>> => {
  const ratedPlatforms = await getMetricClient<PlatformRatingData[]>(
    '/api/games/platforms/rating',
    params
  );

  return {
    error: ratedPlatforms.error,
    data: ratedPlatforms.data
  };
};

/**
 * @param props
 * @param props.platforms - All platforms of user's games.
 * @param props.genres - All genres of user's games.
 * @param props.userId - User whose metrics will be fetched.
 * @returns Metric component of top platforms by average rating with top games and genre.
 */
export default function PlatformsRatings({
  platforms,
  genres,
  userId
}: MetricCoreProps) {
  return (
    <MetricWrapper id='platforms-rating'>
      <FetchMetric
        fetchMetricData={fetchPlatformsRatings}
        metric={(data) => (
          <div className='ratings-group'>
            {data.map((ratedPlatform) => (
              <RatedPlatform
                key={`${ratedPlatform.id}-rated`}
                ratedPlatform={ratedPlatform}
                platform={platforms.findByKey(ratedPlatform.id)}
                topGenre={genres.findByKey(ratedPlatform.topGenre)}
              />
            ))}
          </div>
        )}
        fallback={<PlatformsRatingsSkeleton />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
