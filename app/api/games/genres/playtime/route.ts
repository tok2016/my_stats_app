import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getPlaytimeMetric } from '@lib/metrics/playtime-metric';

const getGenresHours: GameEndpointAction<'/api/games/genres/playtime'> = async (
  _req,
  _params,
  games
) => {
  const genresHoursMetric = getPlaytimeMetric(games, 'genresIds');

  return NextResponse.json(genresHoursMetric, {
    status: 200,
    statusText: 'Genres were calculated by playtime'
  });
};

export const GET = gameEndpoint(getGenresHours);
