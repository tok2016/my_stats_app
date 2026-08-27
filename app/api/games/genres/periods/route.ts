import { NextResponse } from 'next/server';

import { PrecisePeriod } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getPeriodMetric } from '@lib/metrics/periods-metric';

const GENRES_IN_PERIOD = 3;

const getTopGenresByPeriod: GameEndpointAction<
  '/api/games/genres/periods'
> = async (req, _params, games) => {
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
