import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getPlaytimeMetric } from '@lib/metrics/playtime-metric';

const getPlatformsPlaytime = async (games: GameCore[]) => {
  const platformsPlaytime = getPlaytimeMetric(games, 'platformId');
  return NextResponse.json(platformsPlaytime, {
    status: 200,
    statusText: 'Platforms were calculated by playtime'
  });
};

export const GET = gameEndpoint(getPlatformsPlaytime);
