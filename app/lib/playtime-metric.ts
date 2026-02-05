import { GameCore } from '@ts/games/game';
import { PlaytimeData } from '@ts/games/metric';

import { isNumberOrString, isNumberOrStringArray } from './type-guards';
import { MINUTES } from './utils';

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
    topGame: game.minutes >= previosGame.minutes ? game : previosGame
  });
};

export const getPlaytimeMetric = (
  games: GameCore[],
  dataField: keyof GameCore
): PlaytimeData[] => {
  const itemsMap = new Map<number, PlaytimeData>();
  games.forEach((game) => {
    if (isNumberOrStringArray(game[dataField]))
      game[dataField].forEach((item) => setPlaytimeData(item, game, itemsMap));
    else if (isNumberOrString(game[dataField]))
      setPlaytimeData(game[dataField], game, itemsMap);
  });

  const playtimeMetric = itemsMap
    .entries()
    .map((entry) => entry[1])
    .toArray()
    .sort((a, b) => b.hours - a.hours);

  return playtimeMetric;
};
