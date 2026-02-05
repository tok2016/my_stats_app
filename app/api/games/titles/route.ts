import { NextResponse } from 'next/server';

import Game, { GameCore } from '@ts/games/game';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getFullGames } from '@lib/games-utils';

const getTopGamesByPlaytime = async (games: GameCore[]) => {
  const gamesMap = new Map<number, GameCore>();

  games.forEach((game) => {
    gamesMap.set(game.apiId, game);
  });

  const fullGames = await getFullGames(gamesMap);

  const fullGamesMap: Record<string, Game> = Object.fromEntries(
    fullGames.map((game) => [game.id, game])
  );

  return NextResponse.json(fullGamesMap, {
    status: 200,
    statusText: 'Games full information was found'
  });
};

export const GET = gameEndpoint(getTopGamesByPlaytime);
