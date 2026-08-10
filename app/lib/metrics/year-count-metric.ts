import { GameCore } from '@ts/games/game';
import { YearCountMetric } from '@ts/games/metric';

import { gameCoreToShort } from '@lib/games/games-utils';

import { isDateSource } from '../type-guards';
import { GAMES_IN_METRIC } from '../utils';

export const getYearCountMetric = (
  games: GameCore[],
  dateField: keyof GameCore
): YearCountMetric[] => {
  const yearsMap = new Map<number, YearCountMetric>();

  games.forEach((game) => {
    if (!isDateSource(game[dateField])) return;
    const date = new Date(game[dateField]);

    if (!date.getTime()) return;
    const year = date.getFullYear();

    const yearData = yearsMap.get(year);
    if (!yearData)
      yearsMap.set(year, {
        year,
        count: 1,
        topGames: [gameCoreToShort(game)]
      });
    else {
      yearData.count++;
      yearData.topGames.push(gameCoreToShort(game));
    }
  });

  const yearsMetric: YearCountMetric[] = [];
  const sortedYears = yearsMap
    .keys()
    .toArray()
    .sort((a, b) => a - b);

  for (
    let year = sortedYears[0] ?? 0;
    year <= (sortedYears.at(-1) ?? 0);
    year++
  ) {
    const yearCount = yearsMap.get(year);
    const top = yearCount?.topGames
      .sort((a, b) => b.hours - a.hours)
      .slice(0, GAMES_IN_METRIC);

    yearsMetric.push({
      year,
      count: yearCount?.count ?? 0,
      topGames: top ?? []
    });
  }

  return yearsMetric;
};
