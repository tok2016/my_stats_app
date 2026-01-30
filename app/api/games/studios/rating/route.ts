import { NextRequest, NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { StudioField } from '@ts/games/metric';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getRatingMetric } from '@lib/games-utils';

const getStudiosRating = async (games: GameCore[], req: NextRequest) => {
  const studioType =
    (req.nextUrl.searchParams.get('field') as StudioField) ?? 'developersIds';

  const studiosRatingMetric = getRatingMetric(games, studioType);

  return NextResponse.json(studiosRatingMetric, {
    status: 200,
    statusText: 'Studios were calculated by mean rating'
  });
};

export const GET = gameEndpoint(getStudiosRating);
