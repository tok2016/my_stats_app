import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameEndpoint } from '@lib/endpoint-generators';

const TOP_GAMES = 10;

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

export const GET = gameEndpoint(getTopGamesByPlaytime);
