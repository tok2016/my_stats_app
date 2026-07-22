import { NextRequest, NextResponse } from 'next/server';

import { IgdbGenre } from '@ts/games/genre';
import Platform, { IgdbPlatform } from '@ts/games/platform';
import { IgdbSeries } from '@ts/games/series';
import Token from '@ts/users/token';

import { protectedEndpoint } from '@lib/endpoint-generators';
import { getItemById, getTopItem } from '@lib/games/games-utils';
import { getImageUrl } from '@lib/games/igdb';

type PlatformParams = {
  platformId?: string;
};

const getPlatformById = async (
  token: Token,
  _req: NextRequest,
  params?: PlatformParams
) => {
  const [basicInfo, igdbPlatform] = await getItemById<IgdbPlatform>(
    token,
    ['platformId'],
    ['name', 'platform_family.name', 'platform_logo.image_id'],
    params?.platformId
  );

  const platform: Platform = {
    ...basicInfo,
    family: igdbPlatform.platform_family,
    logo: igdbPlatform.platform_logo?.image_id
      ? getImageUrl(igdbPlatform.platform_logo.image_id, 'logo_med')
      : undefined,
    topSeries: getTopItem<IgdbSeries>(basicInfo.games, 'series'),
    topGenre: getTopItem<IgdbGenre>(basicInfo.games, 'genres')
  };

  return NextResponse.json(platform, {
    status: 200,
    statusText: 'Platform was found'
  });
};

export const GET = protectedEndpoint(getPlatformById);
