import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getPlaytimeMetric } from '@lib/metrics/playtime-metric';

/**
 * Public method. Calculates top genres by playtime of their games.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Top genres by playtime with top game.
 */
const getGenresHours: GameEndpointAction<'/api/games/genres/playtime'> = async (
  _req,
  _params,
  games
) => {
  const genresHoursMetric = getPlaytimeMetric(games, 'genresIds');

  return NextResponse.json(genresHoursMetric, {
    status: 200,
    statusText: 'Genres were calculated by playtime'
  });
};

export const GET = gameMetricEndpoint(getGenresHours);
