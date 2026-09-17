import { NextResponse } from 'next/server';

import { CountCompareData, MetricMap } from '@ts/games/metric';
import { PlatformRatingData } from '@ts/games/platform';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getRatingMetric } from '@lib/metrics/rating-metric';
import { ITEMS_IN_RATING } from '@lib/utils';

/**
 * Public method. Calculates top platforms by average rating of their games.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found, no game of theirs is found or ranked.
 * @returns Top platforms by average rating with top rated games and genre.
 */
const getPlatformsRatings: GameEndpointAction<
  '/api/games/platforms/rating'
> = async (_req, _params, games) => {
  //Map of platform id and map of genres.
  const genresByPlatforms = new Map<
    number | string,
    MetricMap<CountCompareData>
  >();

  //Calculates playtime and games count for every genres of every platform.
  games.forEach((game) => {
    game.genresIds.forEach((genre) => {
      const platformGenre = genresByPlatforms.get(game.platformId);

      genresByPlatforms.set(game.platformId, {
        ...platformGenre,
        [genre]: {
          id: genre,
          count: (platformGenre?.[genre]?.count ?? 0) + 1,
          hours: (platformGenre?.[genre]?.hours ?? 0) + game.hours
        }
      });
    });
  });

  //Calculates top platforms by average rating and top rated games.
  const platformsRatings = getRatingMetric(
    games,
    'platformId',
    ITEMS_IN_RATING
  );

  //Defines top genre of every platforms by games count and playtime.
  const platfromsAndGenres: PlatformRatingData[] = platformsRatings.map(
    (ratingData) => {
      const platformGenres = genresByPlatforms.get(ratingData.id) ?? {};
      const topGenre = Object.entries(platformGenres).sort((a, b) => {
        const countDiff = b[1].count - a[1].count;
        if (!countDiff) return b[1].hours - a[1].hours;
        return countDiff;
      })[0][0];

      return {
        ...ratingData,
        topGenre: Number(topGenre) ?? 0
      };
    }
  );

  return NextResponse.json(platfromsAndGenres, {
    status: 200,
    statusText: 'Platforms were calculated by mean rating'
  });
};

export const GET = gameMetricEndpoint(getPlatformsRatings);
