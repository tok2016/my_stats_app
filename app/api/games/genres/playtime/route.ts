import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getPlaytimeMetric } from '@lib/playtime-metric';

const getGenresHours = async (games: GameCore[]) => {
  const genresHoursMetric = getPlaytimeMetric(games, 'genresIds');

  return NextResponse.json(genresHoursMetric, {
    status: 200,
    statusText: 'Genres were calculated by playtime'
  });
};

export const GET = gameEndpoint(getGenresHours);
