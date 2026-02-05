import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getGenres } from '@lib/games-utils';

const getGenresResponse = async (games: GameCore[]) => {
  const genresMap = await getGenres(games);
  return NextResponse.json(genresMap, {
    status: 200,
    statusText: 'Genres were found'
  });
};

export const GET = gameEndpoint(getGenresResponse);
