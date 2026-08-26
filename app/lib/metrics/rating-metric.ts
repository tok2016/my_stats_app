import { GameCore, GameShort } from '@ts/games/game';
import { RatingData } from '@ts/games/metric';
import { RequiredFields } from '@ts/util-types';

import { gameCoreToShort } from '@lib/games/games-utils';
import ObjectMapArray from '@lib/object-map-array';

import { isNumberOrString, isNumberOrStringArray } from '../type-guards';
import { GAMES_IN_METRIC } from '../utils';
import { mean } from '../utils';

const setRatingData = (
  item: number | string,
  game: GameShort,
  data: ObjectMapArray<RatingData, 'id'>
) => {
  const currentItemRating = data.findByKey(item);

  if (!currentItemRating) {
    const itemId = Number(item);
    data.push({
      id: Number.isNaN(itemId) ? 0 : itemId,
      rating: 0,
      topGames: [game]
    });
  } else currentItemRating.topGames.push(game);
};

export const getRatingMetric = (
  games: GameCore[],
  dataField: keyof GameCore,
  topSize?: number
): RatingData[] => {
  const itemsRatingData = new ObjectMapArray<RatingData, 'id'>([], 'id');

  games.forEach((game) => {
    if (isNumberOrStringArray(game[dataField]))
      game[dataField].forEach((item) =>
        setRatingData(item, gameCoreToShort(game), itemsRatingData)
      );
    else if (isNumberOrString(game[dataField]))
      setRatingData(game[dataField], gameCoreToShort(game), itemsRatingData);
  });

  const ratingDataMetric = itemsRatingData
    .map((ratingData): RatingData | undefined => {
      const gamesWithRating = ratingData.topGames.filter(
        (game) => typeof game.rating === 'number'
      ) as RequiredFields<GameShort, 'rating'>[];

      const rating = mean(gamesWithRating.map((game) => game.rating));

      if (!rating) return;
      return {
        id: ratingData.id,
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
