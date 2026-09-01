import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';

const TOP_RATING_GAMES = 12;

const getHighestRatedGames: GameEndpointAction<
  '/api/games/titles/rating'
> = async (_req, _params, games) => {
  const topGamesIds = games
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .filter((game) => typeof game.rating === 'number')
    .slice(0, TOP_RATING_GAMES)
    .toArray()
    .map((game) => game.id);

  return NextResponse.json(topGamesIds, {
    status: 200,
    statusText: 'TOP-12 highest rated games was calculated'
  });
};

export const GET = gameMetricEndpoint(getHighestRatedGames);
