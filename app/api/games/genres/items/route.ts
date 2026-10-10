import { NextResponse } from 'next/server';

import { IgdbGenre } from '@ts/games/genre';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { igdbRequest } from '@lib/games/igdb';
import { generateErrorResponse } from '@lib/utils';

/**
 * Finds all genres of user's games
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game or genre of theirs is found.
 * @returns Basic data of all user's genres.
 */
const getGenres: GameEndpointAction<'/api/games/genres/items'> = async (
  _req,
  _params,
  games
) => {
  const genresIds = new Set(games.flatMap((game) => game.genresIds))
    .values()
    .toArray();

  if (!genresIds.length) throw generateErrorResponse(404, 'No genre was found');

  const igdbGenres = await igdbRequest<IgdbGenre>('/genres', {
    fields: ['name'],
    where: `id=(${genresIds.join(',')})`
  });

  return NextResponse.json(igdbGenres, {
    status: 200,
    statusText: 'Genres were found'
  });
};

export const GET = gameMetricEndpoint(getGenres);
