import { IgdbBasic } from '@ts/games/api-response';
import Game from '@ts/games/game';

import AxiosInstanse from '@lib/axios-instanse';
import { isItemArray } from '@lib/type-guards';

export const getGamesMap = async () => {
  const response = await AxiosInstanse.get<Game[]>('/api/games');
  const gamesMap = new Map(response.data.map((game) => [game.id, game]));
  return gamesMap;
};

export const getItemsMap = async <ItemType extends IgdbBasic>(
  gamesMap: Map<string, Game>,
  itemField: keyof Game,
  typeGuard: (value: unknown) => value is ItemType
) => {
  const itemsMap = new Map<number, ItemType>();

  gamesMap.forEach((game) => {
    if (isItemArray(game[itemField], typeGuard))
      game[itemField].forEach((item) => {
        itemsMap.set(item.id, item);
      });
    else if (typeGuard(game[itemField]))
      itemsMap.set(game[itemField].id, game[itemField]);
  });

  return itemsMap;
};
