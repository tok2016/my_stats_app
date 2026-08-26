import { GameCore, GameShort } from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';

import { gameCoreToShort } from '@lib/games/games-utils';
import ObjectMapArray from '@lib/object-map-array';

import { isNumberOrString, isNumberOrStringArray } from '../type-guards';
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

const setPlaytimeData = (
  item: number | string,
  game: GameShort,
  data: ObjectMapArray<PlaytimeData, 'id'>
) => {
  const currentItem = data.findByKey(item);

  if (!currentItem) {
    const itemId = Number(item);
    data.push({
      id: Number.isNaN(itemId) ? 0 : itemId,
      hours: game.hours,
      count: 1,
      percent: 0,
      topGame: game
    });
  } else {
    currentItem.hours += game.hours;
    currentItem.count++;
    currentItem.topGame =
      game.hours > currentItem.topGame.hours ? game : currentItem.topGame;
  }
};

export const getPlaytimeMetric = (
  games: GameCore[],
  dataField: keyof GameCore
): PlaytimeData[] => {
  const itemsMap = new ObjectMapArray<PlaytimeData, 'id'>([], 'id');
  games.forEach((game) => {
    if (isNumberOrStringArray(game[dataField]))
      game[dataField].forEach((item) =>
        setPlaytimeData(item, gameCoreToShort(game), itemsMap)
      );
    else if (isNumberOrString(game[dataField]))
      setPlaytimeData(game[dataField], gameCoreToShort(game), itemsMap);
  });

  return getTopCountData(itemsMap);
};
