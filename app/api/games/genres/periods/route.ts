import { NextResponse } from 'next/server';

import { PrecisePeriod } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getPeriodMetric } from '@lib/metrics/periods-metric';

const GENRES_IN_PERIOD = 3;

/**
 * Public method. Calculates top genres by playtime of every month / season / year. Season is default period type.
 * @param req - Request object with period type.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Top genres with playtime by periods.
 */
const getTopGenresByPeriod: GameEndpointAction<
  '/api/games/genres/periods'
> = async (req, _params, games) => {
  const periodType =
    (req.nextUrl.searchParams.get('period') as PrecisePeriod) ?? 'season';

  const periodTops = getPeriodMetric(
    games,
    periodType,
    'genresIds',
    GENRES_IN_PERIOD
  );

  return NextResponse.json(periodTops, {
    status: 200,
    statusText: `Genres tops were calculated by ${periodType}`
  });
};

export const GET = gameMetricEndpoint(getTopGenresByPeriod);
