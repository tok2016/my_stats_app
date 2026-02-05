import { NextRequest, NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { PrecisePeriod } from '@ts/games/metric';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getPeriodMetric } from '@lib/metrics/periods-metric';

const PLATFORMS_IN_PERIOD = 1;

const getPlatformsPeriods = async (games: GameCore[], req: NextRequest) => {
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

export const GET = gameEndpoint(getPlatformsPeriods);
