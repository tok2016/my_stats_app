import { GameCore } from '@ts/games/game';
import { YearCountMetric } from '@ts/games/metric';

import { gameCoreToShort } from '@lib/games/games-utils';
import ObjectMapArray from '@lib/object-map-array';

import { isDateSource } from '../type-guards';
import { GAMES_IN_METRIC } from '../utils';

export const getYearCountMetric = (
  games: GameCore[],
  dateField: keyof GameCore
): YearCountMetric[] => {
  const yearsMap = new ObjectMapArray<YearCountMetric, 'year'>([], 'year');

  games.forEach((game) => {
    if (!isDateSource(game[dateField])) return;
    const date = new Date(game[dateField]);

    if (!date.getTime()) return;
    const year = date.getFullYear();

    const yearData = yearsMap.findByKey(year);
    if (!yearData)
      yearsMap.push({
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
  const sortedYears = yearsMap.sort((a, b) => a.year - b.year);

  const fromYear = sortedYears.at(0)?.year ?? 0;
  const toYear = sortedYears.at(-1)?.year ?? 0;

  for (let year = fromYear; year <= toYear; year++) {
    const yearCount = yearsMap.findByKey(year);
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
