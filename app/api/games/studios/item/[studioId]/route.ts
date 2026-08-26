import { NextRequest, NextResponse } from 'next/server';

import Game from '@ts/games/game';
import { IgdbGenre } from '@ts/games/genre';
import { IgdbSeries } from '@ts/games/series';
import { IgdbStudio, Studio } from '@ts/games/studio';
import Token from '@ts/users/token';

import { protectedEndpoint } from '@lib/endpoint-generators';
import { getItemById, getTopItem } from '@lib/games/games-utils';
import { getImageUrl } from '@lib/games/igdb';
import ObjectMapArray from '@lib/object-map-array';

type StudioParam = {
  studioId?: string;
};

type SeriesCompareData = IgdbSeries & {
  count: number;
  hours: number;
};

const getStudioById = async (
  token: Token,
  _req: NextRequest,
  params?: StudioParam
) => {
  const [basicInfo, igdbStudio] = await getItemById<IgdbStudio>(
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
    params?.studioId
  );

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

    if (!series)
      seriesMapArray.push({
        ...game.series,
        count: 1,
        hours: game.hours
      });
    else {
      series.count++;
      series.hours += game.hours;
    }
  });

  seriesMapArray.sort((a, b) => {
    const countDiff = b.count - a.count;
    if (!countDiff) return b.hours - a.hours;
    return countDiff;
  });

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
    topGenre: getTopItem<IgdbGenre>(basicInfo.games, 'genres')
  };

  return NextResponse.json(studio, {
    status: 200,
    statusText: 'Studio was found'
  });
};

export const GET = protectedEndpoint(getStudioById);
