import { NextResponse } from 'next/server';

import { PeriodGamesTops, PrecisePeriod } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getPeriodMetric } from '@lib/metrics/periods-metric';
import { TOP_ENTRIES } from '@lib/utils';

/**
 * Public method. Calculates top games by playtime of every month / season / year. Season is default period type.
 * @param req - Request object with period type.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Top games by periods.
 */
const getGamesPeriods: GameEndpointAction<'/api/games/titles/periods'> = async (
  req,
  _params,
  games
) => {
  const periodType =
    (req.nextUrl.searchParams.get('period') as PrecisePeriod) ?? 'year';

  const gameIdsPeriods = getPeriodMetric(games, periodType, 'id', TOP_ENTRIES);
  const gamePeriods: PeriodGamesTops = {
    periodType,
    tops: gameIdsPeriods.tops.map((periodTop) => ({
      period: periodTop.period,
      top: periodTop.top
        .map((gameId) => games.findByKey(gameId.id))
        .filter((game) => !!game)
    }))
  };

  return NextResponse.json(gamePeriods, {
    status: 200,
    statusText: `TOP-3 games was calculated by ${periodType}`
  });
};

export const GET = gameMetricEndpoint(getGamesPeriods);
