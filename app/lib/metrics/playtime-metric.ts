import { GameCore } from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';
import { ExtractTypeFields } from '@ts/util-types';

import ObjectMapArray from '@lib/object-map-array';
import { isKeyOfArrayField } from '@lib/type-guards';

import { MAX_ENTRIES_IN_CHART, getPercentThreshold } from '../utils';

const getTopCountData = (
  itemsCount: ObjectMapArray<PlaytimeData, 'id'>
): PlaytimeData[] => {
  let sum = 0;
  let max = 0;

  itemsCount
    .sort((a, b) => b.hours - a.hours)
    .forEach((value) => {
      sum += value.count;
      max = value.count > max ? value.count : max;
    });

  const threshold = getPercentThreshold((max / sum) * 100, sum);
  const countData: PlaytimeData[] = [];

  for (let i = 0; i < MAX_ENTRIES_IN_CHART + 1; i++) {
    const data = itemsCount.at(i);
    if (!data) break;

    const percent = (data.count / sum) * 100;

    if (percent < threshold || i === MAX_ENTRIES_IN_CHART) {
      let count = 0;
      let hours = 0;
      let topGame = data.topGame;

      itemsCount.slice(i).forEach((value) => {
        count += value.count;
        hours += value.hours;
        topGame = value.topGame.hours > topGame.hours ? value.topGame : topGame;
      });

      countData.push({
        id: -1,
        count,
        hours,
        percent: Math.round((count / sum) * 100),
        topGame
      });

      break;
    }

    countData.push({
      id: data.id,
      count: data.count,
      hours: data.hours,
      percent: Math.round(percent),
      topGame: data.topGame
    });
  }

  return countData;
};

const aggregatePlaytimeData = (
  game: GameCore,
  item: number | string,
  stored?: PlaytimeData
): PlaytimeData | undefined => ({
  id: item,
  count: (stored?.count ?? 0) + 1,
  hours: (stored?.hours ?? 0) + game.hours,
  percent: 0,
  topGame: !stored || game.hours > stored.topGame.hours ? game : stored.topGame
});

export const getPlaytimeMetric = (
  games: ObjectMapArray<GameCore, 'apiId'>,
  itemField: ExtractTypeFields<GameCore, number | string | Array<number>>
): PlaytimeData[] => {
  const itemsMap = isKeyOfArrayField(itemField, games.at(0))
    ? games.flatGroupBy(aggregatePlaytimeData, itemField, 'id', undefined)
    : games.groupBy(aggregatePlaytimeData, itemField, 'id', undefined);

  return getTopCountData(itemsMap);
};
