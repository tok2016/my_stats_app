import { GameCore } from '@ts/games/game';
import { YearCountMetric } from '@ts/games/metric';
import { ExtractTypeFields } from '@ts/util-types';

import { gameCoreToShort } from '@lib/games/games-utils';
import ObjectMapArray from '@lib/object-map-array';

import { GAMES_IN_METRIC } from '../utils';

type GameCoreYear = GameCore & { year: number };

const DEFAULT_YEAR = new Date(0).getFullYear();

const aggregateYearCount = (
  game: GameCoreYear,
  year: number,
  stored?: YearCountMetric
) => {
  if (year === DEFAULT_YEAR) return undefined;

  const gameShort = gameCoreToShort(game);
  if (stored) stored.topGames.push(gameShort);
  return {
    year,
    count: (stored?.count ?? 0) + 1,
    topGames: stored ? stored.topGames : [gameShort]
  };
};

export const getYearCountMetric = (
  games: ObjectMapArray<GameCore, 'apiId'>,
  dateField: ExtractTypeFields<GameCore, string | undefined>
): YearCountMetric[] => {
  const yearsMap = games
    .mapByKey<
      GameCoreYear,
      'apiId'
    >((game) => ({ ...game, year: new Date(game[dateField] ?? 0).getFullYear() }), 'apiId')
    .groupBy(aggregateYearCount, 'year', 'year', undefined);

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
