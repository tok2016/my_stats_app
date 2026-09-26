import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { generateErrorResponse } from '@lib/utils';

const TOP_RATING_GAMES = 12;

/**
 * Public method. Returns highest rated games by user.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found, no game of theirs is found or ranked.
 * @returns Array of highest rated games ids.
 */
const getHighestRatedGames: GameEndpointAction<
  '/api/games/titles/rating'
> = async (_req, _params, games) => {
  const topGamesIds = games
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .filter((game) => typeof game.rating === 'number')
    .slice(0, TOP_RATING_GAMES)
    .toArray()
    .map((game) => game.id);

  if (!topGamesIds.length)
    throw generateErrorResponse(404, 'No game was ranked');

  return NextResponse.json(topGamesIds, {
    status: 200,
    statusText: 'TOP-12 highest rated games was calculated'
  });
};

export const GET = gameMetricEndpoint(getHighestRatedGames);
