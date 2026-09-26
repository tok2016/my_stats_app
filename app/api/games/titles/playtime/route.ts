import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';

const TOP_GAMES = 10;

/**
 * Public method. Returns longest played games.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Array of longest played games ids.
 */
const getTopGamesByPlaytime: GameEndpointAction<
  '/api/games/titles/playtime'
> = async (_req, _params, games) => {
  const topGamesIds = games
    .sort((a, b) => b.hours - a.hours)
    .slice(0, TOP_GAMES)
    .toArray()
    .map((game) => game.id);

  return NextResponse.json(topGamesIds, {
    status: 200,
    statusText: 'TOP-10 longest played games were calculated'
  });
};

export const GET = gameMetricEndpoint(getTopGamesByPlaytime);
