import { GameCore } from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';

import { isNumberOrString, isNumberOrStringArray } from '../type-guards';
import { MAX_ENTRIES_IN_CHART, MINUTES, getPercentThreshold } from '../utils';

const getTopCountData = (
  itemsCount: Map<number | string, PlaytimeData>
): PlaytimeData[] => {
  let sum = 0;
  let max = 0;

  const values = itemsCount
    .values()
    .toArray()
    .sort((a, b) => b.hours - a.hours);

  values.forEach((value) => {
    sum += value.count;
    max = value.count > max ? value.count : max;
  });

  const threshold = getPercentThreshold((max / sum) * 100, sum);
  const countData: PlaytimeData[] = [];

  for (let i = 0; i < MAX_ENTRIES_IN_CHART + 1; i++) {
    const data = values[i];
    if (!data) break;

    const percent = (data.count / sum) * 100;

    if (percent < threshold || i === MAX_ENTRIES_IN_CHART) {
      let count = 0;
      let hours = 0;
      let topGame = values[i].topGame;

      values.slice(i).forEach((value) => {
        count += value.count;
        hours += value.hours;
        topGame =
          value.topGame.minutes > topGame.minutes ? value.topGame : topGame;
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
  game: GameCore,
  map: Map<number | string, PlaytimeData>
) => {
  const currentItem = map.get(item);
  const previosGame = currentItem?.topGame ?? game;

  map.set(item, {
    id: Number(item) ?? 0,
    hours: (currentItem?.hours ?? 0) + Math.round(game.minutes / MINUTES),
    count: (currentItem?.count ?? 0) + 1,
    percent: 0,
    topGame: game.minutes >= previosGame.minutes ? game : previosGame
  });
};

export const getPlaytimeMetric = (
  games: GameCore[],
  dataField: keyof GameCore
): PlaytimeData[] => {
  const itemsMap = new Map<number | string, PlaytimeData>();
  games.forEach((game) => {
    if (isNumberOrStringArray(game[dataField]))
      game[dataField].forEach((item) => setPlaytimeData(item, game, itemsMap));
    else if (isNumberOrString(game[dataField]))
      setPlaytimeData(game[dataField], game, itemsMap);
  });

  return getTopCountData(itemsMap);
};
