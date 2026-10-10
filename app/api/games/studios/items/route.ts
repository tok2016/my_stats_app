import { NextResponse } from 'next/server';

import { IgdbStudioBase } from '@ts/games/studio';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/games/igdb';
import { generateErrorResponse } from '@lib/utils';

/**
 * Finds all studios (both developers and publishers) of user's games
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game or studio of theirs is found.
 * @returns Basic data of all user's studios.
 */
const getStudios: GameEndpointAction<'/api/games/studios/items'> = async (
  _req,
  _params,
  games
) => {
  const studiosIds = new Set([
    ...games.flatMap((game) => game.developersIds),
    ...games.flatMap((game) => game.publishersIds)
  ])
    .values()
    .toArray();

  if (!studiosIds.length)
    throw generateErrorResponse(404, 'No studio was found');

  const igdbStudios = await igdbRequest<IgdbStudioBase>('/genres', {
    fields: ['name', 'country'],
    where: `id=(${studiosIds.join(',')})`
  });

  return NextResponse.json(igdbStudios, {
    status: 200,
    statusText: 'Studios were found'
  });
};

export const GET = gameMetricEndpoint(getStudios);
