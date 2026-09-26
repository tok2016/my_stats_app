import { NextResponse } from 'next/server';

import { PrecisePeriod } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getPeriodMetric } from '@lib/metrics/periods-metric';

const PLATFORMS_IN_PERIOD = 1;

/**
 * Public method. Calculates top platforms by playtime of every month / season / year. Season is default period type.
 * @param req - Request object with period type.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Top platforms with playtime by periods.
 */
const getPlatformsPeriods: GameEndpointAction<
  '/api/games/platforms/periods'
> = async (req, _params, games) => {
  const periodType =
    (req.nextUrl.searchParams.get('period') as PrecisePeriod) ?? 'year';

  const platformPeriods = getPeriodMetric(
    games,
    periodType,
    'platformId',
    PLATFORMS_IN_PERIOD
  );

  return NextResponse.json(platformPeriods, {
    status: 200,
    statusText: `Platforms tops were calculated by ${periodType}`
  });
};

export const GET = gameMetricEndpoint(getPlatformsPeriods);
