import { NextResponse } from 'next/server';

import { IgdbSeries } from '@ts/games/series';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/games/igdb';
import { generateErrorResponse } from '@lib/utils';

/**
 * Finds all series of user's games
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game or studio of theirs is found.
 * @returns Basic data of all user's series.
 */
const getSeries: GameEndpointAction<'/api/games/series'> = async (
  _req,
  _params,
  games
) => {
  const seriesIds = new Set(
    games.map((game) => game.seriesId).filter((series) => !!series)
  )
    .values()
    .toArray();

  if (!seriesIds.length)
    throw generateErrorResponse(404, 'No series were found');

  const igdbSeries = await igdbRequest<IgdbSeries>('/genres', {
    fields: ['name', 'games'],
    where: `id=(${seriesIds.join(',')})`
  });

  return NextResponse.json(igdbSeries, {
    status: 200,
    statusText: 'Series were found'
  });
};

export const GET = gameMetricEndpoint(getSeries);
