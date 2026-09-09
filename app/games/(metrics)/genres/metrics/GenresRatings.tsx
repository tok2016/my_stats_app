'use client';

import Game from '@ts/games/game';
import { MetricContentProps, RatingData } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import { getSingularOrPlural } from '@lib/utils';

import Rating from '@components/Rating';
import Skeleton from '@components/Skeleton';
import GameCover from '@components/data-blocks/GameCover';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';

type RatedGenreProps = {
  ratingData: RatingData;
  genre?: Game['genres'][number];
};

const RATED_GENRES_COUNT = 5;

function RatedGenre({ ratingData, genre }: RatedGenreProps) {
  if (!genre) return;

  const topGame = ratingData.topGames[0];
  if (!topGame) return;
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

export function GenresRatingsSkeleton() {
  return (
    <div className='blocks-group'>
      {Array.from({ length: RATED_GENRES_COUNT }).map((_, i) => (
        <div
          className='data-block genre-rating-block'
          key={`rated-genre-skeleton-${i}`}
        >
          <Skeleton type='h4' unitClassName='rating-title-skeleton' />

          <div className='data-block-content'>
            <span className='min'>Best game:</span>
            <Skeleton type='image' className='game-cover' />
            <Skeleton />
            <Skeleton fontSize='min' />
          </div>
        </div>
      ))}
    </div>
  );
}

const fetchGenresRatings = async (params: {
  userId: string;
}): Promise<MetricResponse<RatingData[]>> => {
  const ratingData = await getMetricClient<RatingData[]>(
    '/api/games/genres/rating',
    params
  );

  return ratingData;
};

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
    <MetricWrapper id={metricId}>
      <FetchMetric
        fetchMetricData={fetchGenresRatings}
        metric={(data) => (
          <div className='blocks-group'>
            {data.map((value) => (
              <RatedGenre
                key={`${value.id}-rating`}
                ratingData={value}
                genre={genres.findByKey(value.id)}
              />
            ))}
          </div>
        )}
        fallback={<GenresRatingsSkeleton />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
