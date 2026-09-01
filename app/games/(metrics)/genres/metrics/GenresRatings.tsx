import { Suspense } from 'react';

import Game from '@ts/games/game';
import { MetricContentProps, MetricId, RatingData } from '@ts/games/metric';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';
import { getSingularOrPlural } from '@lib/utils';

import Rating from '@components/Rating';
import EmptyMetric from '@components/data-blocks/EmptyMetric';
import GameCover from '@components/data-blocks/GameCover';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import GenresRatingsSkeleton from '../skeletons/GenresRatingsSkeleton';

type HighestRatedGenresProps = {
  metricId: MetricId;
  genres: ObjectMapArray<Game['genres'][number], 'id'>;
  userId: string;
};

type RatedGenreProps = {
  ratingData: RatingData;
  genre?: Game['genres'][number];
};

function RatedGenre({ ratingData, genre }: RatedGenreProps) {
  if (!genre) return;

  const topGame = ratingData.topGames[0];
  return (
    <div className='data-block genre-rating-block'>
      <div className='rating-title'>
        <Rating value={ratingData.rating} />
        <h4 className='colored'>{genre.name}</h4>
      </div>

      <div className='data-block-content'>
        <span className='min'>Best game:</span>

        <GameCover game={topGame} />

        <p className='bold small'>{topGame.name}</p>

        <span className='min'>
          {topGame.hours} {getSingularOrPlural(topGame.hours, 'hour', 'hours')}
        </span>
      </div>
    </div>
  );
}

async function HighestRatedGenres({
  genres,
  metricId,
  userId
}: HighestRatedGenresProps) {
  const ratingData = await getMetricData<RatingData[]>(
    '/api/games/genres/rating',
    [],
    userId
  );

  return (
    <MetricWrapper id={metricId}>
      {!ratingData.length ? (
        <EmptyMetric message={`You haven't rated any game yet`} />
      ) : (
        <div className='blocks-group'>
          {ratingData.map((data) => (
            <RatedGenre
              key={`${data.id}-rating`}
              ratingData={data}
              genre={genres.findByKey(data.id)}
            />
          ))}
        </div>
      )}
    </MetricWrapper>
  );
}

export default function GenresRatings({
  metricId,
  games,
  userId
}: MetricContentProps) {
  const genres = games.flatMapByKey<Game['genres'][number], 'id'>(
    (game) => game.genres,
    'id'
  );

  return (
    <Suspense fallback={<GenresRatingsSkeleton />}>
      <HighestRatedGenres genres={genres} metricId={metricId} userId={userId} />
    </Suspense>
  );
}
