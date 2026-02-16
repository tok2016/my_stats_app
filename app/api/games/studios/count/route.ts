import { NextRequest, NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { StudioField } from '@ts/games/metric';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getPlaytimeMetric } from '@lib/metrics/playtime-metric';

const getStudiosCount = async (games: GameCore[], req: NextRequest) => {
  const studioType =
    (req.nextUrl.searchParams.get('field') as StudioField) ?? 'developersIds';

  const playtimeStudios = getPlaytimeMetric(games, studioType);
  playtimeStudios.sort((a, b) => b.count - a.count);

  return NextResponse.json(playtimeStudios, {
    status: 200,
    statusText: 'Studios were calculated by games count'
  });
};

export const GET = gameEndpoint(getStudiosCount);
