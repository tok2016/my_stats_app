import { NextResponse } from 'next/server';

import { StudioField } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getPlaytimeMetric } from '@lib/metrics/playtime-metric';

const getStudiosCount: GameEndpointAction<'/api/games/studios/count'> = async (
  req,
  _params,
  games
) => {
  const studioType =
    (req.nextUrl.searchParams.get('field') as StudioField) ?? 'developersIds';

  const playtimeStudios = getPlaytimeMetric(games, studioType)
    .filter((playtime) => playtime.id !== -1)
    .sort((a, b) => b.count - a.count);

  return NextResponse.json(playtimeStudios, {
    status: 200,
    statusText: 'Studios were calculated by games count'
  });
};

export const GET = gameMetricEndpoint(getStudiosCount);
