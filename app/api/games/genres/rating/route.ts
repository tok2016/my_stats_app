import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getRatingMetric } from '@lib/metrics/rating-metric';
import { ITEMS_IN_RATING } from '@lib/utils';

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

export const GET = gameEndpoint(getHighestRatedGenres);
