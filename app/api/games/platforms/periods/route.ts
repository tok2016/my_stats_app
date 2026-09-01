import { NextResponse } from 'next/server';

import { PrecisePeriod } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getPeriodMetric } from '@lib/metrics/periods-metric';

const PLATFORMS_IN_PERIOD = 1;

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
