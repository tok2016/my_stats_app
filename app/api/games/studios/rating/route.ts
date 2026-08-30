import { NextResponse } from 'next/server';

import { IgdbGameRatings } from '@ts/games/game';
import { StudioField } from '@ts/games/metric';
import { StudioRatingMetric } from '@ts/games/studio';
import { GameEndpointAction } from '@ts/requests';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getAverageRating } from '@lib/games/games-utils';
import { igdbRequest } from '@lib/games/igdb';
import { getRatingMetric } from '@lib/metrics/rating-metric';
import ObjectMapArray from '@lib/object-map-array';
import { ITEMS_IN_RATING } from '@lib/utils';

const getStudiosRating: GameEndpointAction<
  '/api/games/studios/rating'
> = async (req, _params, games) => {
  const studioType =
    (req.nextUrl.searchParams.get('field') as StudioField) ?? 'developersIds';

  const studiosRatings = getRatingMetric(games, studioType);

  if (!studiosRatings.length)
    return NextResponse.json([], {
      status: 200,
      statusText: 'Studios ratings list is empty'
    });

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

export const GET = gameEndpoint(getStudiosRating);
