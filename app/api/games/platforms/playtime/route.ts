import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getPlaytimeMetric } from '@lib/metrics/playtime-metric';

/**
 * Public method. Calculates top platforms by playtime of their games.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Top platforms by playtime with top game.
 */
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
