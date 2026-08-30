import { NextResponse } from 'next/server';

import Game from '@ts/games/game';
import { ItemCompareData } from '@ts/games/metric';
import Platform, { IgdbPlatform } from '@ts/games/platform';
import { ProtectedEndpointAction } from '@ts/requests';

import { protectedEndpoint } from '@lib/endpoint-generators';
import { getItemById, getTopItem } from '@lib/games/games-utils';
import { getImageUrl } from '@lib/games/igdb';

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

const aggregateGenre = (
  game: Game,
  genre: Game['genres'][number],
  stored?: ItemCompareData<Game['genres'][number]>
) => ({
  ...genre,
  count: (stored?.count ?? 0) + 1,
  hours: (stored?.hours ?? 0) + game.hours
});

const getPlatformById: ProtectedEndpointAction<
  '/api/games/platforms/item/[platformId]'
> = async (_req, params, token) => {
  const { platformId } = await params;

  const [basicInfo, igdbPlatform] = await getItemById<IgdbPlatform>(
    token,
    ['platformId'],
    ['name', 'platform_family.name', 'platform_logo.image_id'],
    platformId
  );

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

export const GET = protectedEndpoint(getPlatformById);
