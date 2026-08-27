import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getCountMetric } from '@lib/metrics/count-metric';

const getPlatformsCount: GameEndpointAction<
  '/api/games/platforms/count'
> = async (_req, _params, games) => {
  const platformsCount = getCountMetric(games, 'platformId');
  return NextResponse.json(platformsCount, {
    status: 200,
    statusText: 'Platforms were calculated by games count'
  });
};

export const GET = gameEndpoint(getPlatformsCount);
