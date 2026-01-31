import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';

import { getCountMetric } from '@lib/count-metric';
import { gameEndpoint } from '@lib/endpoint-generators';

const getPlatformsCount = async (games: GameCore[]) => {
  const platformsCount = await getCountMetric(games, 'platformId');
  return NextResponse.json(platformsCount, {
    status: 200,
    statusText: 'Platforms were calculated by games count'
  });
};

export const GET = gameEndpoint(getPlatformsCount);
