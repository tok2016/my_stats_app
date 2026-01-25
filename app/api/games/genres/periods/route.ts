import { NextRequest, NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import {
  Metric,
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
  const periodLists: PeriodTops<Metric<number>> = {};

  games.forEach((game) => {
    if (game.playDate) {
      const period = getPeriodDate[periodType](game.playDate);

      game.genresIds.forEach((genre) => {
        if (!periodLists[period]) periodLists[period] = {};

        periodLists[period][genre] =
          (periodLists[period]?.[genre] ?? 0)
          + Math.round(game.minutes / MINUTES);
      });
    }
  });

  const periodEntries = Object.entries(periodLists).map(([year, list]) => {
    const top = Object.entries(list)
      .sort((a, b) => a[1] - b[1])
      .slice(0, TOP_ENTRIES);

    return [year, Object.fromEntries(top)];
  });

  const periodTops: PeriodTopsMetric<Metric<number>> = {
    period: periodType,
    tops: Object.fromEntries(periodEntries)
  };

  return NextResponse.json(periodTops, {
    status: 200,
    statusText: `Genres tops were calculated by ${periodType}`
  });
};

export const GET = gameEndpoint(getTopGenresByPeriod);
