import { NextResponse } from 'next/server';

import { PrecisePeriod } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getPeriodMetric } from '@lib/metrics/periods-metric';
import { TOP_ENTRIES } from '@lib/utils';

const getGamesPeriods: GameEndpointAction<'/api/games/titles/periods'> = async (
  req,
  _params,
  games
) => {
  const periodType =
    (req.nextUrl.searchParams.get('period') as PrecisePeriod) ?? 'year';

  const gamePeriods = getPeriodMetric(games, periodType, 'id', TOP_ENTRIES);
  return NextResponse.json(gamePeriods, {
    status: 200,
    statusText: `TOP-3 games was calculated by ${periodType}`
  });
};

export const GET = gameMetricEndpoint(getGamesPeriods);
