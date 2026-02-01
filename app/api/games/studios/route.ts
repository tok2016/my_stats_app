import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getStudios } from '@lib/games-utils';

const getStudiosResponse = async (games: GameCore[]) => {
  const studiosMap = await getStudios(games);

  return NextResponse.json(studiosMap, {
    status: 200,
    statusText: 'Studios were found'
  });
};

export const GET = gameEndpoint(getStudiosResponse);
