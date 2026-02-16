import { GameCore, GameShort } from '@ts/games/game';
import { RatingData } from '@ts/games/metric';
import { RequiredFields } from '@ts/util-types';

import { isNumberOrString, isNumberOrStringArray } from '../type-guards';
import { GAMES_IN_METRIC } from '../utils';
import { mean } from '../utils';

const setRatingData = (
  item: number | string,
  game: GameCore,
  map: Map<number | string, RatingData>
) => {
  const currentItemRating = map.get(item);
  if (!currentItemRating)
    map.set(item, {
      id: Number(item) ?? 0,
      rating: 0,
      topGames: [game]
    });
  else currentItemRating.topGames.push(game);
};

export const getRatingMetric = (
  games: GameCore[],
  dataField: keyof GameCore,
  topSize?: number
): RatingData[] => {
  const itemsMap = new Map<number, RatingData>();

  games.forEach((game) => {
    if (isNumberOrStringArray(game[dataField]))
      game[dataField].forEach((item) => setRatingData(item, game, itemsMap));
    else if (isNumberOrString(game[dataField]))
      setRatingData(game[dataField], game, itemsMap);
  });

  const ratingDataMetric = itemsMap
    .entries()
    .map(([item, ratingData]): RatingData | undefined => {
      const gamesWithRating = ratingData.topGames.filter(
        (game) => typeof game.rating === 'number'
      ) as RequiredFields<GameShort, 'rating'>[];

      const rating = mean(gamesWithRating.map((game) => game.rating));

      if (!rating) return;
      return {
        id: item,
        rating,
        topGames: gamesWithRating
          .sort((a, b) => b.rating - a.rating)
          .slice(0, GAMES_IN_METRIC)
      };
    })
    .filter((ratingData) => !!ratingData)
    .toArray()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, topSize);

  return ratingDataMetric;
};
