import { NextRequest, NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import {
  MetricMap,
  PeriodTops,
  PeriodTopsMetric,
  PrecisePeriodParams
} from '@ts/games/metric';

import { gameEndpoint } from '@lib/endpoint-generators';
import { TOP_ENTRIES } from '@lib/games-utils';
import { MINUTES, getPeriodDate } from '@lib/utils';

const getTopGenresByPeriod = async (
  games: GameCore[],
  _req: NextRequest,
  params?: PrecisePeriodParams
) => {
  const periodType = params?.period ?? 'year';
  const periodLists: PeriodTops<MetricMap<number>> = {};

  games.forEach((game) => {
    if (game.playDate && game.playDate.getTime()) {
      const period = getPeriodDate[periodType](game.playDate);

      game.genresIds.forEach((genre) => {
        if (!periodLists[period]) periodLists[period] = {};

        periodLists[period][genre] =
          (periodLists[period]?.[genre] ?? 0)
          + Math.round(game.minutes / MINUTES);
      });
    }
  });

  const periodTops = Object.entries(periodLists).map(([year, list]) => {
    const top = Object.entries(list)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0])
      .slice(0, TOP_ENTRIES);

    return [year, top];
  });

  const periodTopsMetric: PeriodTopsMetric<MetricMap<number>> = {
    period: periodType,
    tops: Object.fromEntries(periodTops)
  };

  return NextResponse.json(periodTopsMetric, {
    status: 200,
    statusText: `Genres tops were calculated by ${periodType}`
  });
};

export const GET = gameEndpoint(getTopGenresByPeriod);
