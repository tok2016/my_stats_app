import { IgdbBasic, IgdbItemInfo, IgdbQuery } from '@ts/games/api-response';
import Game, {
  GameCore,
  GameShort,
  IgdbGameFull,
  IgdbRecommendedGame,
  RecommendedGame
} from '@ts/games/game';
import { IgdbImageSize } from '@ts/games/image';
import { ItemCompareData } from '@ts/games/metric';
import { PlatformShort } from '@ts/games/platform';
import { IgdbSeriesExpanded } from '@ts/games/series';
import { ExtractTypeFields, LiteralType } from '@ts/util-types';

import ObjectMapArray from '@lib/object-map-array';

import { generateErrorResponse, mean } from '../utils';
import { getImageUrl, igdbRequest } from './igdb';

const MAX_SCREENSHOTS = 3;

const AllowedSources: Record<number, string> = {
  1: 'steam',
  5: 'gog',
  11: 'microsoft',
  13: 'apple',
  15: 'android'
};

export const FULL_GAME_FIELDS: Required<IgdbQuery<IgdbGameFull>>['fields'] = [
  'name',
  'cover.image_id',
  'first_release_date',
  'platforms.name',
  'platforms.platform_family.name',
  'platforms.platform_logo.image_id',
  'collections.games',
  'collections.name',
  'genres.name',
  'involved_companies.developer',
  'involved_companies.publisher',
  'involved_companies.company.name',
  'involved_companies.company.country',
  'aggregated_rating',
  'rating',
  'screenshots.image_id'
];

export const SERIES_EXPANDED_FIELDS: Required<
  IgdbQuery<IgdbSeriesExpanded>
>['fields'] = [
  'games.aggregated_rating',
  'games.rating',
  'games.involved_companies.developer',
  'games.involved_companies.publisher',
  'games.involved_companies.company.name',
  'games.involved_companies.company.country',
  'name'
];

const igdbPlatfromToPlatformShort = (
  igdbPlatform: IgdbGameFull['platforms'][number] | undefined
): PlatformShort | undefined =>
  !igdbPlatform
    ? undefined
    : {
        id: igdbPlatform.id,
        name: igdbPlatform.name,
        logo: igdbPlatform.platform_logo
          ? getImageUrl(igdbPlatform.platform_logo.image_id, 'logo_med')
          : undefined,
        family: igdbPlatform.platform_family
      };

export const uniteGameCoreAndIgdb = (
  gameCore: GameCore,
  igdbGame: IgdbGameFull,
  screenshotSize: IgdbImageSize = 'screenshot_med',
  screenshotsCount: number = MAX_SCREENSHOTS
): Game => ({
  id: gameCore.id,
  name: gameCore.name,
  apiId: gameCore.apiId,
  rating: gameCore.rating,
  criticsRating: igdbGame.aggregated_rating
    ? Math.round(igdbGame.aggregated_rating)
    : undefined,
  usersRating: igdbGame.rating ? Math.round(igdbGame.rating) : undefined,
  releasedAt: gameCore.releasedAt,
  hours: gameCore.hours,
  playDate: gameCore.playDate,
  developers:
    igdbGame.involved_companies
      ?.filter((studio) => studio.developer)
      .map((studio) => studio.company) ?? [],
  publishers:
    igdbGame.involved_companies
      ?.filter((studio) => studio.publisher)
      .map((studio) => studio.company) ?? [],
  platform: igdbPlatfromToPlatformShort(
    igdbGame.platforms.find(
      (igdbPlatform) => igdbPlatform.id === gameCore.platformId
    )
  ),
  series: igdbGame.collections?.reduce((prev, curr) =>
    curr.games.length > prev.games.length ? curr : prev
  ),
  genres: igdbGame.genres,
  coverUrl: igdbGame.cover?.image_id
    ? getImageUrl(igdbGame.cover.image_id, 'cover_big')
    : undefined,
  screenshots: igdbGame.screenshots
    ?.slice(0, screenshotsCount)
    .map((screenshot) => getImageUrl(screenshot.image_id, screenshotSize))
});

export const gameCoreToShort = (game: GameCore): GameShort => ({
  id: game.id,
  apiId: game.apiId,
  name: game.name,
  hours: game.hours,
  rating: game.rating,
  coverUrl: game.coverId ? getImageUrl(game.coverId, 'cover_big') : undefined
});

export const formRecommendedGame = (
  igdbGame: IgdbRecommendedGame
): RecommendedGame => {
  //Stores sources of game to avoid the same links.
  const sources: Record<number, boolean> = {};

  return {
    id: igdbGame.id,
    name: igdbGame.name,
    rating: igdbGame.rating,
    coverUrl: igdbGame.cover
      ? getImageUrl(igdbGame.cover.image_id, 'cover_big')
      : undefined,
    genres: igdbGame.genres,
    screenshots: igdbGame.screenshots
      ?.slice(0, MAX_SCREENSHOTS)
      .map((screenshot) => getImageUrl(screenshot.image_id, 'screenshot_med')),
    external: igdbGame.external_games
      .filter((external) => {
        if (!sources[external.external_game_source.id]) {
          sources[external.external_game_source.id] = true;
          return !!AllowedSources[external.external_game_source.id];
        }

        return false;
      })
      .map((external) => ({
        id: external.id,
        url: external.url,
        source: {
          id: external.external_game_source.id,
          name: external.external_game_source.name
        }
      }))
  };
};

/**
 * Fetches games from IGDB and unites them with stored core data.
 * @param games - Stored core game data.
 * @returns Game full data.
 */
export const getFullGames = async (
  games: ObjectMapArray<GameCore, 'apiId'>
): Promise<ObjectMapArray<Game, 'id'>> => {
  const apiIds = games.map((game) => game.apiId).toArray();
  const igdbGames = await igdbRequest<IgdbGameFull>('/games', {
    fields: FULL_GAME_FIELDS,
    where: `id = (${apiIds.join(',')})`,
    limit: apiIds.length
  });

  const fullGames = new ObjectMapArray(
    igdbGames
      .map((igdbGame) => {
        const game = games.findByKey(igdbGame.id);
        if (!game) return;
        return uniteGameCoreAndIgdb(game, igdbGame);
      })
      .filter((game) => !!game),
    'id'
  );

  return fullGames;
};

const fieldToEndpoint: Record<
  ExtractTypeFields<Required<Game>, { id: number } | { id: number }[]>,
  string
> = {
  series: '/collections',
  developers: '/companies',
  publishers: '/companies',
  platform: '/platforms',
  genres: '/genres'
};

/**
 * Finds item (genre, platform, studio, etc.) by given field and id.
 * @param games - Games data.
 * @param field - Item field of game core to search games by.
 * @param itemId - Item id.
 * @param igdbFields - Fields of IGDB data to include.
 * @throws 404 if item was not found.
 * @returns Tuple of item full data and raw item IGDB data.
 */
export const tryGetItemById = async <IgdbDataType extends IgdbBasic>(
  games: ObjectMapArray<Game, 'id'>,
  field: ExtractTypeFields<Required<Game>, { id: number } | { id: number }[]>,
  itemId: number,
  igdbFields: LiteralType<keyof IgdbDataType>[]
): Promise<[IgdbItemInfo, IgdbDataType]> => {
  //Filters games by given field and item id.
  const filteredGames = games.filter((game) => {
    if (Array.isArray(game[field]))
      return game[field].some((item) => item.id === itemId);
    return game[field]?.id === itemId;
  });

  //Finds item from IGDB by given id.
  try {
    const igdbItem = (
      await igdbRequest<IgdbDataType>(fieldToEndpoint[field], {
        fields: igdbFields,
        where: `id = ${itemId}`
      })
    )[0];

    //Calculates aggregated values of games grouped by item.
    const itemInfo: IgdbItemInfo = {
      id: igdbItem.id,
      name: igdbItem.name,
      hours: filteredGames.toArray().reduce((sum, curr) => sum + curr.hours, 0),
      averageRating: getAverageRating(filteredGames, 'rating'),
      criticsRating: getAverageRating(filteredGames, 'criticsRating'),
      usersRating: getAverageRating(filteredGames, 'usersRating'),
      games: filteredGames
    };

    return [itemInfo, igdbItem] as const;
  } catch {
    throw generateErrorResponse(404, 'Item was not found');
  }
};

/**
 * Calculates mean values of rating field.
 * @param games - Games data.
 * @param field - Rating field.
 * @returns Mean rating.
 */
export const getAverageRating = <
  GameType extends object,
  RatingField extends keyof GameType
>(
  games: ObjectMapArray<GameType, RatingField> | Array<GameType>,
  field: RatingField
) => {
  const values: number[] = [];
  games.forEach((game) => {
    if (typeof game[field] === 'number') values.push(game[field]);
  });

  const meanValue = mean(values);
  return typeof meanValue === 'number' ? Math.round(meanValue) : undefined;
};

/**
 * Returns top item by its games count or playtime.
 * @param compareData - Item compare data with games count and playtime.
 * @returns Item with the biggest games count and playtime.
 */
export const getTopItem = <IgdbData extends IgdbBasic>(
  compareData: ObjectMapArray<ItemCompareData<IgdbData>, 'id'>
): IgdbData | undefined => {
  return compareData
    .sort((a, b) => {
      const countDiff = b.count - a.count;
      if (!countDiff) return b.hours - a.hours;
      return countDiff;
    })
    .at(0);
};
