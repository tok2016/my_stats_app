import { IgdbBasic, IgdbItemInfo, IgdbQuery } from '@ts/games/api-response';
import Game, {
  GameCore,
  GameInSchema,
  GameShort,
  IgdbGameFull
} from '@ts/games/game';
import { IgdbGenre } from '@ts/games/genre';
import { ItemCompareData } from '@ts/games/metric';
import { PlatformShort } from '@ts/games/platform';
import { IgdbSeriesExpanded } from '@ts/games/series';
import Token from '@ts/users/token';
import { LiteralType } from '@ts/util-types';

import { getCredentialsById } from '../auth';
import { GamesModel } from '../models';
import { isIgdbItemArray, isIgdbItemBasic } from '../type-guards';
import { MINUTES, generateErrorResponse, mean } from '../utils';
import { getImageUrl, igdbRequest } from './igdb';

type ItemsFields = keyof Omit<GameInSchema, 'userId' | 'storeId'>;

const MAX_SCREENSHOTS = 3;

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

export const getGenres = async (games: GameCore[]) => {
  const genresIds = new Set<number>();
  games.forEach((game) => {
    game.genresIds.forEach((genre) => {
      genresIds.add(genre);
    });
  });

  const genres = await igdbRequest<IgdbGenre>('/genres', {
    fields: ['name'],
    where: `id = (${genresIds.values().toArray().join(',')})`,
    limit: genresIds.size
  });

  const genresMap: Record<number, IgdbGenre> = Object.fromEntries(
    genres.map((genre) => [genre.id, genre])
  );

  return genresMap;
};

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
  igdbGame: IgdbGameFull
): Game => ({
  id: gameCore.id,
  name: gameCore.name,
  apiId: gameCore.apiId,
  rating: gameCore.rating,
  criticsRating: igdbGame.aggregated_rating
    ? Math.round(igdbGame.aggregated_rating)
    : undefined,
  usersRating: igdbGame.rating ? Math.round(igdbGame.rating) : undefined,
  releasedAt: gameCore.releasedAt ? new Date(gameCore.releasedAt) : undefined,
  hours: Math.round(gameCore.minutes / MINUTES),
  playDate: gameCore.playDate ? new Date(gameCore.playDate) : undefined,
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
  cover: igdbGame.cover?.image_id
    ? getImageUrl(igdbGame.cover.image_id, 'cover_big')
    : undefined,
  screenshots: igdbGame.screenshots
    ?.slice(0, MAX_SCREENSHOTS)
    .map((screenshot) => getImageUrl(screenshot.image_id, 'screenshot_med'))
});

export const gameCoreToShort = (game: GameCore): GameShort => ({
  id: game.id,
  apiId: game.apiId,
  name: game.name,
  hours: Math.round(game.minutes / MINUTES),
  rating: game.rating,
  cover: game.cover ? getImageUrl(game.cover, 'cover_big') : undefined
});

export const getFullGames = async (
  gamesMap: Map<number, GameCore>
): Promise<Game[]> => {
  const apiIds = gamesMap.keys().toArray();
  const igdbGames = await igdbRequest<IgdbGameFull>('/games', {
    fields: FULL_GAME_FIELDS,
    where: `id = (${apiIds.join(',')})`,
    limit: apiIds.length
  });

  const fullGames = igdbGames
    .map((igdbGame) => {
      const game = gamesMap.get(igdbGame.id);
      if (!game) return;
      return uniteGameCoreAndIgdb(game, igdbGame);
    })
    .filter((game) => !!game);

  return fullGames;
};

const fieldToEndpoint: Record<ItemsFields, string> = {
  apiId: '/games',
  name: '/games',
  seriesId: '/collections',
  developersIds: '/companies',
  publishersIds: '/companies',
  platformId: '/platforms',
  genresIds: '/genres',
  themesId: '/themes',
  playDate: '/games',
  minutes: '/games',
  releasedAt: '/release_dates',
  cover: '/covers',
  rating: '/games'
};

export const getItemById = async <IgdbDataType extends IgdbBasic>(
  token: Token,
  fields: ItemsFields[],
  igdbFields: LiteralType<keyof IgdbDataType>[],
  id?: string
): Promise<[IgdbItemInfo, IgdbDataType]> => {
  if (!id) throw generateErrorResponse(400, 'ID was not provided');

  const credentials = await getCredentialsById(token.id);
  const parsedId = Number(id);
  const additionalFilters = fields.map((field) => ({ [field]: parsedId }));

  const gamesCore = (
    await GamesModel.find({
      userId: credentials.userId,
      $or: additionalFilters
    }).lean()
  ).map((game) => ({ ...game, id: game._id.toString() }));

  const igdbItem = (
    await igdbRequest<IgdbDataType>(fieldToEndpoint[fields[0] ?? 'apiId'], {
      fields: igdbFields,
      where: `id = ${parsedId}`
    })
  )[0];

  const fullGames = await getFullGames(mapGamesByApiId(gamesCore));
  const itemInfo: IgdbItemInfo = {
    id: igdbItem.id,
    name: igdbItem.name,
    hours: getTotalPlaytime(gamesCore),
    averageRating: getAverageRating<Game>(fullGames, 'rating'),
    criticsRating: getAverageRating<Game>(fullGames, 'criticsRating'),
    usersRating: getAverageRating<Game>(fullGames, 'usersRating'),
    games: fullGames
  };

  return [itemInfo, igdbItem] as const;
};

export const getAverageRating = <GameType extends object>(
  games: GameType[],
  field: keyof GameType
) => {
  const values: number[] = [];
  games.forEach((game) => {
    if (typeof game[field] === 'number') values.push(game[field]);
  });

  const meanValue = mean(values);
  return typeof meanValue === 'number' ? Math.round(meanValue) : undefined;
};

export const getTotalPlaytime = (games: GameCore[]): number =>
  Math.round(
    games.map((game) => game.minutes).reduce((prev, curr) => prev + curr, 0)
      / MINUTES
  );

const setItemToMap = (
  item: IgdbBasic,
  game: Game,
  map: Map<number | string, ItemCompareData>
) => {
  const currentItem = map.get(item.id);
  if (!currentItem)
    map.set(item.id, {
      item,
      count: 1,
      hours: game.hours
    });
  else {
    currentItem.count++;
    currentItem.hours += game.hours;
  }
};

export const getTopItem = <IgdbData extends IgdbBasic>(
  games: Game[],
  dataField: keyof Game
): IgdbData => {
  const itemsMap = new Map<number | string, ItemCompareData<IgdbData>>();

  games.forEach((game) => {
    if (isIgdbItemBasic(game?.[dataField]))
      setItemToMap(game[dataField], game, itemsMap);
    else if (isIgdbItemArray(game?.[dataField]))
      game[dataField].forEach((item) => {
        setItemToMap(item, game, itemsMap);
      });
  });

  return itemsMap
    .values()
    .toArray()
    .sort((a, b) => {
      const countDiff = b.count - a.count;
      if (!countDiff) return b.hours - a.hours;
      return countDiff;
    })
    .map((data) => data.item)[0];
};

export const mapGamesByApiId = (games: GameCore[]) => {
  const gamesMap = new Map<number, GameCore>(
    games.map((game) => [game.apiId, game])
  );

  return gamesMap;
};
