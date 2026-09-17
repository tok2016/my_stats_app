import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getRatingMetric } from '@lib/metrics/rating-metric';
import { ITEMS_IN_RATING } from '@lib/utils';

/**
 * Public method. Calculates top genres by average rating of their games.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found, no game of theirs is found or ranked.
 * @returns Top genres by average rating with top game.
 */
const getHighestRatedGenres: GameEndpointAction<
  '/api/games/genres/rating'
> = async (_req, _params, games) => {
  const genresRatingMetric = getRatingMetric(
    games,
    'genresIds',
    ITEMS_IN_RATING
  );

  return NextResponse.json(genresRatingMetric, {
    status: 200,
    statusText: 'Genres were calculated by mean rating'
  });
};

export const GET = gameMetricEndpoint(getHighestRatedGenres);
