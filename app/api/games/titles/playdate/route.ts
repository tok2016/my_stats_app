import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getYearCountMetric } from '@lib/metrics/year-count-metric';

const getPlayDatesPerYear: GameEndpointAction<
  '/api/games/titles/playdate'
> = async (_req, _params, games) => {
  const playDates = getYearCountMetric(games, 'playDate');

  return NextResponse.json(playDates, {
    status: 200,
    statusText: 'Games dates of play were calculated by year'
  });
};

export const GET = gameEndpoint(getPlayDatesPerYear);
