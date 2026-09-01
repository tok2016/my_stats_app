import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getCountMetric } from '@lib/metrics/count-metric';

const getGenresCount: GameEndpointAction<'/api/games/genres/count'> = async (
  _req,
  _params,
  games
) => {
  const genresCountMetric = getCountMetric(games, 'genresIds');

  return NextResponse.json(genresCountMetric, {
    status: 200,
    statusText: 'Genres were calculated by games count'
  });
};

export const GET = gameMetricEndpoint(getGenresCount);
