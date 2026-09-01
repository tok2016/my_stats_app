import { Suspense } from 'react';

import Game from '@ts/games/game';
import { MetricContentProps, MetricId } from '@ts/games/metric';
import { PlatformRatingData } from '@ts/games/platform';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import Rating from '@components/Rating';
import EmptyMetric from '@components/data-blocks/EmptyMetric';
import GameTableTitle from '@components/data-blocks/GameTitle';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import PlatformsRatingsSkeleton from '../skeletons/PlatformsRatingsSkeleton';

type HighestRatedPlatformsProps = {
  metricId: MetricId;
  platforms: ObjectMapArray<NonNullable<Game['platform']>, 'id'>;
  genres: ObjectMapArray<Game['genres'][number], 'id'>;
  userId: string;
};

type RatedPlatformProps = {
  ratedPlatform: PlatformRatingData;
  platform: Game['platform'];
  topGenre?: Game['genres'][number];
};

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

async function HighestRatedPlatforms({
  metricId,
  platforms,
  genres,
  userId
}: HighestRatedPlatformsProps) {
  const ratedPlatforms = await getMetricData<PlatformRatingData[]>(
    '/api/games/platforms/rating',
    [],
    userId
  );

  return (
    <MetricWrapper id={metricId}>
      {!ratedPlatforms.length ? (
        <EmptyMetric message={`You haven't rated any game yet`} />
      ) : (
        <div className='blocks-group'>
          {ratedPlatforms.map((ratedPlatform) => (
            <RatedPlatform
              key={`${ratedPlatform.id}-rated`}
              ratedPlatform={ratedPlatform}
              platform={platforms.findByKey(ratedPlatform.id)}
              topGenre={genres.findByKey(ratedPlatform.topGenre)}
            />
          ))}
        </div>
      )}
    </MetricWrapper>
  );
}

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
    <Suspense fallback={<PlatformsRatingsSkeleton />}>
      <HighestRatedPlatforms
        metricId={metricId}
        platforms={platforms}
        genres={genres}
        userId={userId}
      />
    </Suspense>
  );
}
