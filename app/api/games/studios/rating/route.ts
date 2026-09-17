import { NextResponse } from 'next/server';

import { IgdbGameRatings } from '@ts/games/game';
import { StudioField } from '@ts/games/metric';
import { StudioRatingMetric } from '@ts/games/studio';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getAverageRating } from '@lib/games/games-utils';
import { igdbRequest } from '@lib/games/igdb';
import { getRatingMetric } from '@lib/metrics/rating-metric';
import ObjectMapArray from '@lib/object-map-array';
import { ITEMS_IN_RATING } from '@lib/utils';

/**
 * Public method. Calculates top studios of given type by average rating of their games.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found, no game of theirs is found or ranked.
 * @returns Top platforms by average rating with top rated games and genre.
 */
const getStudiosRating: GameEndpointAction<
  '/api/games/studios/rating'
> = async (req, _params, games) => {
  //Calculates top studios by average rating of their games given by user.
  const studioType =
    (req.nextUrl.searchParams.get('field') as StudioField) ?? 'developersIds';
  const studiosRatings = getRatingMetric(games, studioType, ITEMS_IN_RATING);

  //Fetches users and critics ratings of games of top rated studios.
  const topGamesIds: number[] = [];
  studiosRatings.forEach((studioRating) => {
    studioRating.topGames.forEach((game) => {
      topGamesIds.push(game.apiId);
    });
  });

  const ratingGames = await igdbRequest<IgdbGameRatings>('/games', {
    fields: ['aggregated_rating', 'rating'],
    where: `id = (${topGamesIds.join(',')})`
  });

  //Calculates mean users and critics ratings for every top studio.
  const gamesRatingsMap = new ObjectMapArray(ratingGames, 'id');
  const studiosFullRatings: StudioRatingMetric[] = studiosRatings.map(
    (studioRating) => {
      const gamesRatings = studioRating.topGames
        .map((game) => gamesRatingsMap.findByKey(game.apiId))
        .filter((game) => !!game);

      return {
        id: studioRating.id,
        averageRating: studioRating.rating,
        topGames: studioRating.topGames.slice(0, ITEMS_IN_RATING),
        criticsRating: getAverageRating(gamesRatings, 'aggregated_rating'),
        usersRating: getAverageRating(gamesRatings, 'rating')
      };
    }
  );

  return NextResponse.json(studiosFullRatings, {
    status: 200,
    statusText: 'Studios were calculated by mean rating'
  });
};

export const GET = gameMetricEndpoint(getStudiosRating);
