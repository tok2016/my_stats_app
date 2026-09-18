import { NextResponse } from 'next/server';

import Game from '@ts/games/game';
import { ItemCompareData } from '@ts/games/metric';
import Platform, { IgdbPlatform } from '@ts/games/platform';
import { GameEndpointAction } from '@ts/requests';

import { gameProtectedEndpoint } from '@lib/endpoint-generators';
import {
  getFullGames,
  getTopItem,
  tryGetItemById
} from '@lib/games/games-utils';
import { getImageUrl } from '@lib/games/igdb';

/**
 * Calculates compate data for series groups.
 * @param game - Game data.
 * @param series - Series id of game.
 * @param stored - Previously stored series group.
 * @returns Series group with aggregated data.
 */
const aggregateSeries = (
  game: Game,
  series: Game['series'],
  stored?: ItemCompareData<NonNullable<Game['series']>>
) => {
  if (!series) return undefined;
  return {
    ...series,
    count: (stored?.count ?? 0) + 1,
    hours: (stored?.hours ?? 0) + game.hours
  };
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
 * Protected method. Finds and calculates platform data by id.
 * @param _req - Request object.
 * @param params - Route params with platform id.
 * @param games - All games of user.
 * @throws 400 if platform id is not given.
 * @throws 404 if platform is not found.
 * @returns Platform full data.
 */
const getPlatformById: GameEndpointAction<
  '/api/games/platforms/item/[platformId]'
> = async (_req, params, games) => {
  //Fetches platform full data from IGDB.
  const { platformId } = await params;

  const gamesFull = await getFullGames(games);
  const [basicInfo, igdbPlatform] = await tryGetItemById<IgdbPlatform>(
    gamesFull,
    'platform',
    Number(platformId),
    ['name', 'platform_family.name', 'platform_logo.image_id']
  );

  //Calculates top genre and series of platform.
  const platform: Platform = {
    ...basicInfo,
    family: igdbPlatform.platform_family,
    logo: igdbPlatform.platform_logo?.image_id
      ? getImageUrl(igdbPlatform.platform_logo.image_id, 'logo_med')
      : undefined,
    topSeries: getTopItem(
      basicInfo.games.groupBy(aggregateSeries, 'series', 'id', 'id')
    ),
    topGenre: getTopItem(
      basicInfo.games.flatGroupBy(aggregateGenre, 'genres', 'id', 'id')
    )
  };

  return NextResponse.json(platform, {
    status: 200,
    statusText: 'Platform was found'
  });
};

export const GET = gameProtectedEndpoint(getPlatformById);
