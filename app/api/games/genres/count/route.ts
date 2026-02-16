import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getCountMetric } from '@lib/metrics/count-metric';

const getGenresCount = async (games: GameCore[]) => {
  const genresCountMetric = getCountMetric(games, 'genresIds');

  return NextResponse.json(genresCountMetric, {
    status: 200,
    statusText: 'Genres were calculated by games count'
  });
};

export const GET = gameEndpoint(getGenresCount);
