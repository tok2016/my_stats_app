import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getYearCountMetric } from '@lib/metrics/year-count-metric';

const getPlayDatesPerYear = async (games: GameCore[]) => {
  const playDates = getYearCountMetric(games, 'playDate');

  return NextResponse.json(playDates, {
    status: 200,
    statusText: 'Games dates of play were calculated by year'
  });
};

export const GET = gameEndpoint(getPlayDatesPerYear);
