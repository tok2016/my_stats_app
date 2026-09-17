import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getCountMetric } from '@lib/metrics/count-metric';

/**
 * Public method. Calculates top platforms by their games count.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Platforms tops by games count with top series.
 */
const getPlatformsCount: GameEndpointAction<
  '/api/games/platforms/count'
> = async (_req, _params, games) => {
  const platformsCount = getCountMetric(games, 'platformId');
  return NextResponse.json(platformsCount, {
    status: 200,
    statusText: 'Platforms were calculated by games count'
  });
};

export const GET = gameMetricEndpoint(getPlatformsCount);
