import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';

import { gameEndpoint } from '@lib/endpoint-generators';

const TOP_GAMES = 10;

const getTopGamesByPlaytime = async (games: GameCore[]) => {
  const topGamesIds = games
    .slice()
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, TOP_GAMES)
    .map((game) => game.id);

  return NextResponse.json(topGamesIds, {
    status: 200,
    statusText: 'TOP-10 longest played games were calculated'
  });
};

export const GET = gameEndpoint(getTopGamesByPlaytime);
