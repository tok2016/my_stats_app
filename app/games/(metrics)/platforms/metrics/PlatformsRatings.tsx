'use client';

import Game from '@ts/games/game';
import { MetricContentProps } from '@ts/games/metric';
import { PlatformRatingData } from '@ts/games/platform';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';

import Rating from '@components/Rating';
import Skeleton from '@components/Skeleton';
import GameTableTitle from '@components/data-blocks/GameTitle';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';

type RatedPlatformProps = {
  ratedPlatform: PlatformRatingData;
  platform: Game['platform'];
  topGenre?: Game['genres'][number];
};

const MAX_PLATFORMS = 5;
const MAX_GAMES = 5;

function RatedPlatform({
  ratedPlatform,
  platform,
  topGenre
}: RatedPlatformProps) {
  if (!platform) return;

  return (
    <div className='data-block rated-platform'>
      <div className='rating-title'>
        <Rating value={ratedPlatform.rating} />
        <h4 className='colored'>{platform.name}</h4>
      </div>

      <div className='small'>
        <span>Main genre: </span>
        {topGenre ? (
          <span className='colored bold'>{topGenre.name}</span>
        ) : (
          <span>none</span>
        )}
      </div>

      <span className='min'>Best games: </span>
      <div className='data-block-content'>
        {ratedPlatform.topGames.map((topGame) => (
          <div
            key={`${ratedPlatform.id}-${topGame.id}`}
            className='game-title-rating'
          >
            <GameTableTitle game={topGame} />
            <Rating value={topGame.rating} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlatformsRatingsSkeleton() {
  return (
    <div className='blocks-group'>
      {Array.from({ length: MAX_PLATFORMS }).map((_, i) => (
        <div
          className='data-block rated-platform'
          key={`rated-platform-skeleton-${i}`}
        >
          <Skeleton type='h4' unitClassName='rating-title-skeleton' />
          <Skeleton />
          <span className='min'>Best games: </span>
          <div className='data-block-content'>
            {Array.from({ length: MAX_GAMES }).map((_, j) => (
              <div
                key={`rated-platform-skeleton-${i}-game-${j}`}
                className='game-table-title'
              >
                <Skeleton
                  type='image'
                  className='game-cover game-table-cover'
                />
                <Skeleton className='game-table-name' />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

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

export default function PlatformsRatings({
  games,
  metricId,
  userId
}: MetricContentProps) {
  const platforms = games.mapByKey<Game['platform'], 'id'>(
    (game) => game.platform,
    'id'
  );
  const genres = games.flatMapByKey<Game['genres'][number], 'id'>(
    (game) => game.genres,
    'id'
  );

  return (
    <MetricWrapper id={metricId}>
      <FetchMetric
        fetchMetricData={fetchPlatformsRatings}
        metric={(data) => (
          <div className='blocks-group'>
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
