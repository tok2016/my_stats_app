import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';

import { gameEndpoint } from '@lib/endpoint-generators';

const TOP_RATING_GAMES = 12;

const getHighestRatedGames = async (games: GameCore[]) => {
  const topGamesIds = games
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .filter((game) => typeof game.rating === 'number')
    .slice(0, TOP_RATING_GAMES)
    .map((game) => game.id);

  return NextResponse.json(topGamesIds, {
    status: 200,
    statusText: 'TOP-12 highest rated games was calculated'
  });
};

export const GET = gameEndpoint(getHighestRatedGames);
