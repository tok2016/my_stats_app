import { NextRequest, NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { PrecisePeriod } from '@ts/games/metric';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getPeriodMetric } from '@lib/periods-metric';
import { TOP_ENTRIES } from '@lib/utils';

const getGamesPeriods = async (games: GameCore[], req: NextRequest) => {
  const periodType =
    (req.nextUrl.searchParams.get('period') as PrecisePeriod) ?? 'year';

  const gamePeriods = getPeriodMetric(games, periodType, 'id', TOP_ENTRIES);
  return NextResponse.json(gamePeriods, {
    status: 200,
    statusText: `TOP-3 games was calculated by ${periodType}`
  });
};

export const GET = gameEndpoint(getGamesPeriods);
