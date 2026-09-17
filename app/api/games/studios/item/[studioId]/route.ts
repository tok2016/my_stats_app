import { NextResponse } from 'next/server';

import Game from '@ts/games/game';
import { ItemCompareData } from '@ts/games/metric';
import { IgdbSeries } from '@ts/games/series';
import { IgdbStudio, Studio } from '@ts/games/studio';
import { ProtectedEndpointAction } from '@ts/requests';

import { protectedEndpoint } from '@lib/endpoint-generators';
import { getTopItem, tryGetItemById } from '@lib/games/games-utils';
import { getImageUrl } from '@lib/games/igdb';
import ObjectMapArray from '@lib/object-map-array';

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
 * @param token - Token object.
 * @throws 400 if studio id is not given.
 * @returns Studio full data.
 */
const getStudioById: ProtectedEndpointAction<
  '/api/games/studios/item/[studioId]'
> = async (_req, params, token) => {
  //Fetches full studio data from IGDB.
  const { studioId } = await params;

  const [basicInfo, igdbStudio] = await tryGetItemById<IgdbStudio>(
    token,
    ['developersIds', 'publishersIds'],
    [
      'name',
      'logo.image_id',
      'country',
      'developed.rating',
      'developed.aggregated_rating',
      'published.rating',
      'published.aggregated_rating'
    ],
    studioId
  );

  //Distributes developed and published games. Forms series array.
  const developed: Game[] = [];
  const published: Game[] = [];
  const seriesMapArray = new ObjectMapArray<SeriesCompareData, 'id'>([], 'id');

  basicInfo.games.forEach((game: Game) => {
    if (game.developers.some((developer) => developer.id === basicInfo.id))
      developed.push(game);

    if (game.publishers.some((publisher) => publisher.id === basicInfo.id))
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
    id: basicInfo.id,
    name: basicInfo.name,
    hours: basicInfo.hours,
    averageRating: basicInfo.averageRating,
    criticsRating: basicInfo.criticsRating,
    usersRating: basicInfo.usersRating,
    developed,
    published,
    series: seriesMapArray.toArray(),
    country: igdbStudio.country,
    logo: igdbStudio.logo?.image_id
      ? getImageUrl(igdbStudio.logo.image_id, 'logo_med')
      : undefined,
    topGenre: getTopItem(
      basicInfo.games.flatGroupBy(aggregateGenre, 'genres', 'id', 'id')
    )
  };

  return NextResponse.json(studio, {
    status: 200,
    statusText: 'Studio was found'
  });
};

export const GET = protectedEndpoint(getStudioById);
