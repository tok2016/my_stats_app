import { NextResponse } from 'next/server';

import Game from '@ts/games/game';
import { ItemCompareData } from '@ts/games/metric';
import { IgdbSeries } from '@ts/games/series';
import { IgdbStudio, Studio } from '@ts/games/studio';
import { GameEndpointAction } from '@ts/requests';

import { gameProtectedEndpoint } from '@lib/endpoint-generators';
import {
  getAverageRating,
  getFullGames,
  getTopItem
} from '@lib/games/games-utils';
import { getImageUrl, igdbRequest } from '@lib/games/igdb';
import ObjectMapArray from '@lib/object-map-array';
import { generateErrorResponse } from '@lib/utils';

type SeriesCompareData = IgdbSeries & {
  count: number;
  hours: number;
};

/**
 * Calculates compate data for genre groups.
 * @param game - Game data.
 * @param genre - Genre from genres array of game.
 * @param stored - Previously stored genre group.
 * @returns Genre group with aggregated data.
 */
const aggregateGenre = (
  game: Game,
  genre: Game['genres'][number],
  stored?: ItemCompareData<Game['genres'][number]>
) => ({
  ...genre,
  count: (stored?.count ?? 0) + 1,
  hours: (stored?.hours ?? 0) + game.hours
});

/**
 * Protected method. Finds and calculates studio data by id.
 * @param _req - Request object.
 * @param params - Route params with studio id.
 * @param games - All games of user.
 * @throws 400 if studio id is not given.
 * @throws 404 if studio is not found.
 * @returns Studio full data.
 */
const getStudioById: GameEndpointAction<
  '/api/games/studios/item/[studioId]'
> = async (_req, params, games) => {
  //Filters games by given field and item id.
  const { studioId } = await params;
  const parsedId = Number(studioId);

  const studiosGames = (await getFullGames(games)).filter(
    (game) =>
      game.developers.some((dev) => dev.id === parsedId)
      || game.publishers.some((pub) => pub.id === parsedId)
  );

  //Finds item from IGDB by given id.
  try {
    const igdbItem = (
      await igdbRequest<IgdbStudio>('/companies', {
        fields: [
          'name',
          'logo.image_id',
          'country',
          'developed.rating',
          'developed.aggregated_rating',
          'published.rating',
          'published.aggregated_rating'
        ],
        where: `id = ${parsedId}`
      })
    )[0];

    //Distributes developed and published games. Forms series array.
    const developed: Game[] = [];
    const published: Game[] = [];
    const seriesMapArray = new ObjectMapArray<SeriesCompareData, 'id'>(
      [],
      'id'
    );

    studiosGames.forEach((game: Game) => {
      if (game.developers.some((developer) => developer.id === igdbItem.id))
        developed.push(game);

      if (game.publishers.some((publisher) => publisher.id === igdbItem.id))
        published.push(game);

      if (!game.series) return;
      const series = seriesMapArray.findByKey(game.series.id);
      seriesMapArray.push({
        ...game.series,
        count: (series?.count ?? 0) + 1,
        hours: (series?.hours ?? 0) + game.hours
      });
    });

    seriesMapArray.sort((a, b) => {
      const countDiff = b.count - a.count;
      if (!countDiff) return b.hours - a.hours;
      return countDiff;
    });

    //Fills studio data.
    const studio: Studio = {
      id: igdbItem.id,
      name: igdbItem.name,
      hours: studiosGames.toArray().reduce((sum, curr) => sum + curr.hours, 0),
      averageRating: getAverageRating(studiosGames, 'rating'),
      criticsRating: getAverageRating(studiosGames, 'criticsRating'),
      usersRating: getAverageRating(studiosGames, 'usersRating'),
      developed,
      published,
      series: seriesMapArray.toArray(),
      country: igdbItem.country,
      logo: igdbItem.logo?.image_id
        ? getImageUrl(igdbItem.logo.image_id, 'logo_med')
        : undefined,
      topGenre: getTopItem(
        studiosGames.flatGroupBy(aggregateGenre, 'genres', 'id', 'id')
      )
    };

    return NextResponse.json(studio, {
      status: 200,
      statusText: 'Studio was found'
    });
  } catch {
    throw generateErrorResponse(404, 'Item was not found');
  }
};

export const GET = gameProtectedEndpoint(getStudioById);
