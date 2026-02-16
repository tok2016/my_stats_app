import { GameCore } from '@ts/games/game';
import {
  MetricMap,
  PeriodTops,
  PeriodTopsMetric,
  PrecisePeriod
} from '@ts/games/metric';

import { isNumberOrString, isNumberOrStringArray } from '../type-guards';
import { MINUTES, getPeriodDate } from '../utils';

const setPeriodList = (
  item: number | string,
  game: GameCore,
  period: string,
  periodLists: Map<string, MetricMap<number>>
) => {
  const periodList = periodLists.get(period);
  const currentGameTime = Math.round(game.minutes / MINUTES);

  periodLists.set(period, {
    ...periodLists.get(period),
    [item]: (periodList?.[item] ?? 0) + currentGameTime
  });
};

export const getPeriodMetric = (
  games: GameCore[],
  periodType: PrecisePeriod,
  dataField: keyof GameCore,
  maxTopEntries: number
): PeriodTopsMetric<string> => {
  const periodLists = new Map<string, MetricMap<number>>();

  games.forEach((game) => {
    if (game.playDate && game.playDate.getTime()) {
      const period = getPeriodDate[periodType](game.playDate);
      if (isNumberOrStringArray(game[dataField]))
        game[dataField].forEach((item) =>
          setPeriodList(item, game, period, periodLists)
        );
      else if (isNumberOrString(game[dataField]))
        setPeriodList(game[dataField], game, period, periodLists);
    }
  });

  const periodTops = periodLists
    .entries()
    .map(([period, list]) => {
      const top = Object.entries(list)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0])
        .slice(0, maxTopEntries);

      const periodTop: PeriodTops<string> = { period, top };
      return periodTop;
    })
    .toArray()
    .sort((a, b) => (a.period >= b.period ? 1 : -1));

  return {
    periodType: periodType,
    tops: periodTops
  };
};
