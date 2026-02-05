import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getYearCountMetric } from '@lib/metrics/year-count-metric';

const getReleasesPerYear = async (games: GameCore[]) => {
  const releases = getYearCountMetric(games, 'releasedAt');

  return NextResponse.json(releases, {
    status: 200,
    statusText: 'Games releases were calculated by year'
  });
};

export const GET = gameEndpoint(getReleasesPerYear);
