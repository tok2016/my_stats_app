import { NextRequest, NextResponse } from 'next/server';

import Game from '@ts/games/game';
import { IgdbGenre } from '@ts/games/genre';
import { IgdbSeries } from '@ts/games/series';
import { IgdbStudio, Studio } from '@ts/games/studio';
import Token from '@ts/users/token';

import { protectedEndpoint } from '@lib/endpoint-generators';
import { getItemById, getTopItem } from '@lib/games/games-utils';

type StudioParam = {
  studioId?: string;
};

type SeriesCompareData = {
  count: number;
  hours: number;
  series: IgdbSeries;
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
      'logo.url',
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
  const seriesMap = new Map<number, SeriesCompareData>();

  basicInfo.games.forEach((game: Game) => {
    if (game.developers.some((developer) => developer.id === basicInfo.id))
      developed.push(game);

    if (game.publishers.some((publisher) => publisher.id === basicInfo.id))
      published.push(game);

    if (!game.series) return;
    const series = seriesMap.get(game.series.id);

    if (!series)
      seriesMap.set(game.series.id, {
        count: 1,
        hours: game.hours,
        series: game.series
      });
    else {
      series.count++;
      series.hours += game.hours;
    }
  });

  const series = seriesMap
    .values()
    .toArray()
    .sort((a, b) => {
      const countDiff = b.count - a.count;
      if (!countDiff) return b.hours - a.hours;
      return countDiff;
    })
    .map((series) => series.series);

  const studio: Studio = {
    id: basicInfo.id,
    name: basicInfo.name,
    hours: basicInfo.hours,
    averageRating: basicInfo.averageRating,
    criticsRating: basicInfo.criticsRating,
    usersRating: basicInfo.usersRating,
    developed,
    published,
    series,
    country: igdbStudio.country,
    logo: igdbStudio.logo?.url,
    topGenre: getTopItem<IgdbGenre>(basicInfo.games, 'genres')
  };

  return NextResponse.json(studio, {
    status: 200,
    statusText: 'Studio was found'
  });
};

export const GET = protectedEndpoint(getStudioById);
