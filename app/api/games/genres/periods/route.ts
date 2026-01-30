import { NextRequest, NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { PrecisePeriod } from '@ts/games/metric';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getPeriodMetric } from '@lib/games-utils';

const GENRES_IN_PERIOD = 3;

const getTopGenresByPeriod = async (games: GameCore[], req: NextRequest) => {
  const periodType =
    (req.nextUrl.searchParams.get('period') as PrecisePeriod) ?? 'year';

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

export const GET = gameEndpoint(getTopGenresByPeriod);
