import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getRatingMetric } from '@lib/rating-metric';

const getHighestRatedGenres = async (games: GameCore[]) => {
  const genresRatingMetric = getRatingMetric(games, 'genresIds');
  return NextResponse.json(genresRatingMetric, {
    status: 200,
    statusText: 'Genres were calculated by mean rating'
  });
};

export const GET = gameEndpoint(getHighestRatedGenres);
