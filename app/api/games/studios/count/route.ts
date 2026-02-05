import { NextRequest, NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { CountPlaytimeData, StudioField } from '@ts/games/metric';

import { gameEndpoint } from '@lib/endpoint-generators';
import { MINUTES } from '@lib/utils';

const getDevelopersCount = async (games: GameCore[], req: NextRequest) => {
  const studioType =
    (req.nextUrl.searchParams.get('field') as StudioField) ?? 'developersIds';

  const studiosMap = new Map<number, CountPlaytimeData>();

  games.forEach((game) => {
    game[studioType].forEach((studioId) => {
      const studio = studiosMap.get(studioId);

      studiosMap.set(studioId, {
        id: studioId,
        count: (studio?.count ?? 0) + 1,
        hours: (studio?.hours ?? 0) + Math.round(game.minutes / MINUTES),
        topGame:
          game.minutes >= (studio?.topGame.minutes ?? 0)
            ? game
            : (studio?.topGame ?? game)
      });
    });
  });

  const studiosCount = studiosMap
    .entries()
    .map((value) => value[1])
    .toArray()
    .sort((a, b) => {
      const countDiff = b.count - a.count;
      if (!countDiff) return b.hours - a.hours;
      return countDiff;
    });

  return NextResponse.json(studiosCount, {
    status: 200,
    statusText: 'Studios were calculated by games count'
  });
};

export const GET = gameEndpoint(getDevelopersCount);
