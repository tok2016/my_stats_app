import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { CountCompareData, MetricMap } from '@ts/games/metric';
import { PlatformRatingData } from '@ts/games/platform';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getRatingMetric } from '@lib/metrics/rating-metric';
import { ITEMS_IN_RATING } from '@lib/utils';

const getPlatformsRatings = async (games: GameCore[]) => {
  const genresByPlatforms = new Map<number, MetricMap<CountCompareData>>();

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

  const platformsRatings = getRatingMetric(
    games,
    'platformId',
    ITEMS_IN_RATING
  );

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

export const GET = gameEndpoint(getPlatformsRatings);
