import { NextResponse } from 'next/server';

import { StudioField } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getPlaytimeMetric } from '@lib/metrics/playtime-metric';

/**
 * Public method. Calculates top studios by their games count and playtime. Default studio type is developer.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Studios tops of given type by games count and playtime with top game.
 */
const getStudiosCountPlaytime: GameEndpointAction<
  '/api/games/studios/count'
> = async (req, _params, games) => {
  const studioType =
    (req.nextUrl.searchParams.get('field') as StudioField) ?? 'developersIds';

  //Excludes united entry of studios that didn't get in top-10.
  const playtimeStudios = getPlaytimeMetric(games, studioType)
    .filter((playtime) => playtime.id !== -1)
    .sort((a, b) => b.count - a.count);

  return NextResponse.json(playtimeStudios, {
    status: 200,
    statusText: 'Studios were calculated by games count'
  });
};

export const GET = gameMetricEndpoint(getStudiosCountPlaytime);
