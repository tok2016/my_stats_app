import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getYearCountMetric } from '@lib/metrics/year-count-metric';

const getReleasesPerYear: GameEndpointAction<
  '/api/games/titles/release'
> = async (_req, _params, games) => {
  const releases = getYearCountMetric(games, 'releasedAt');

  return NextResponse.json(releases, {
    status: 200,
    statusText: 'Games releases were calculated by year'
  });
};

export const GET = gameMetricEndpoint(getReleasesPerYear);
