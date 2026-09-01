import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getPlaytimeMetric } from '@lib/metrics/playtime-metric';

const getPlatformsPlaytime: GameEndpointAction<
  '/api/games/platforms/playtime'
> = async (_req, _params, games) => {
  const platformsPlaytime = getPlaytimeMetric(games, 'platformId');
  return NextResponse.json(platformsPlaytime, {
    status: 200,
    statusText: 'Platforms were calculated by playtime'
  });
};

export const GET = gameMetricEndpoint(getPlatformsPlaytime);
