import { NextResponse } from 'next/server';

import { GameCore, GameShort } from '@ts/games/game';
import { Metric, RatingData } from '@ts/games/metric';
import { Entries, RequiredFields } from '@ts/util-types';

import { gameEndpoint } from '@lib/endpoint-generators';
import { GAMES_IN_METRIC, ITEMS_IN_RATING, getMetric } from '@lib/games-utils';
import { mean } from '@lib/utils';

const getHighestRatedGenres = async (games: GameCore[]) => {
  const iterator = (game: GameCore, map: Metric<RatingData>) => {
    game.genresIds.forEach((genre) => {
      if (map[genre]) map[genre].topGames.push(game);
      else
        map[genre] = {
          rating: 0,
          topGames: [game]
        };
    });
  };

  const comparor = (a: RatingData, b: RatingData) => a.rating - b.rating;
  const sort = (entries: Entries<RatingData>) =>
    entries
      .map(([genre, ratingData]) => {
        const gamesWithRating = ratingData.topGames.filter(
          (game) => typeof game.rating === 'number'
        ) as RequiredFields<GameShort, 'rating'>[];

        const rating: RatingData = {
          rating: mean(gamesWithRating.map((game) => game.rating)),
          topGames: gamesWithRating
            .sort((a, b) => a.rating - b.rating)
            .slice(0, GAMES_IN_METRIC)
        };

        return [genre, rating] as [string, RatingData];
      })
      .sort((a, b) => comparor(a[1], b[1]))
      .slice(0, ITEMS_IN_RATING);

  const genresRatingMetric = getMetric(games, iterator, comparor, sort);
  return NextResponse.json(genresRatingMetric, {
    status: 200,
    statusText: 'Genres were calculated by mean rating'
  });
};

export const GET = gameEndpoint(getHighestRatedGenres);
