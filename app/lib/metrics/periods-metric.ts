import { GameCore } from '@ts/games/game';
import { MetricMap, PeriodPlaytimeTops, PrecisePeriod } from '@ts/games/metric';

import { isNumberOrString, isNumberOrStringArray } from '../type-guards';
import { getPeriodDate } from '../utils';

const setPeriodList = (
  item: number | string,
  game: GameCore,
  period: string,
  periodLists: Map<string, MetricMap<number>>
) => {
  const periodList = periodLists.get(period);
  const currentGameTime = game.hours;

  periodLists.set(period, {
    ...periodList,
    [item]: (periodList?.[item] ?? 0) + currentGameTime
  });
};

export const getPeriodMetric = (
  games: GameCore[],
  periodType: PrecisePeriod,
  dataField: keyof GameCore,
  maxTopEntries: number
): PeriodPlaytimeTops => {
  const periodLists = new Map<string, MetricMap<number>>();

  games.forEach((game) => {
    if (game.playDate) {
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
        .map((entry) => ({
          id:
            typeof games[0][dataField] === 'string'
              ? entry[0]
              : Number(entry[0]),
          hours: entry[1]
        }))
        .slice(0, maxTopEntries);

      const periodTop: PeriodPlaytimeTops['tops'][number] = { period, top };
      return periodTop;
    })
    .toArray()
    .sort((a, b) => (a.period >= b.period ? 1 : -1));

  return {
    periodType: periodType,
    tops: periodTops
  };
};
