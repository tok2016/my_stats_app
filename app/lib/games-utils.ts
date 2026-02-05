import { IgdbBasic, IgdbItemInfo } from '@ts/games/api-response';
import Game, { GameCore, GameInSchema, IgdbGameFull } from '@ts/games/game';
import { IgdbGenre } from '@ts/games/genre';
import { ItemCompareData } from '@ts/games/metric';
import { IgdbStudio, StudioShort } from '@ts/games/studio';
import Token from '@ts/users/token';
import { LiteralType } from '@ts/util-types';

import { getCredentialsById } from './auth';
import { igdbRequest } from './igdb';
import { GamesModel } from './models';
import { isIgdbItemArray, isIgdbItemBasic } from './type-guards';
import { MINUTES, generateErrorResponse, mean } from './utils';

type ItemsFields = keyof Omit<GameInSchema, 'userId' | 'storeId'>;

export const FULL_GAME_FIELDS = [
  'name',
  'slug',
  'cover.url',
  'first_release_date',
  'platforms.name',
  'platforms.slug',
  'platforms.platform_family.name',
  'platforms.platform_family.slug',
  'platforms.platform_logo.url',
  'collections.games',
  'collections.name',
  'collections.slug',
  'genres.name',
  'genres.slug',
  'involved_companies.developer',
  'involved_companies.publisher',
  'involved_companies.company.name',
  'involved_companies.company.slug',
  'involved_companies.company.country'
];

export const getGenres = async (games: GameCore[]) => {
  const genresIds = new Set<number>();
  games.forEach((game) => {
    game.genresIds.forEach((genre) => {
      genresIds.add(genre);
    });
  });

  const genres = await igdbRequest<IgdbGenre>('/genres', {
    fields: ['name', 'slug'],
    where: `id = (${genresIds.values().toArray().join(',')})`,
    limit: genresIds.size
  });

  const genresMap: Record<number, IgdbGenre> = Object.fromEntries(
    genres.map((genre) => [genre.id, genre])
  );

  return genresMap;
};

export const getStudios = async (games: GameCore[]) => {
  const studiosIds = new Set<number>();

  games.forEach((game) => {
    const gameStudios = [...game.developersIds, ...game.publishersIds];
    gameStudios.forEach((studio) => {
      studiosIds.add(studio);
    });
  });

  const studios = await igdbRequest<IgdbStudio>('/companies', {
    fields: ['name', 'slug', 'country', 'developed', 'published', 'logo.url'],
    where: `id = (${studiosIds.values().toArray().join(',')})`,
    limit: studiosIds.size
  });

  const studiosMap: Record<number, StudioShort> = Object.fromEntries(
    studios.map((studio) => [
      studio.id,
      {
        ...studio,
        logo: studio.logo?.url,
        developed: studio.developed?.length ?? 0,
        published: studio.published?.length ?? 0
      }
    ])
  );

  return studiosMap;
};

export const uniteGameCoreAndIgdb = (
  gameCore: GameCore,
  igdbGame: IgdbGameFull
): Game => ({
  id: gameCore.id,
  name: gameCore.name,
  apiId: gameCore.apiId,
  rating: gameCore.rating,
  releasedAt: gameCore.releasedAt,
  hours: Math.round(gameCore.minutes / MINUTES),
  playDate: gameCore.playDate,
  metascore: gameCore.metascore,
  developers:
    igdbGame.involved_companies
      ?.filter((studio) => studio.developer)
      .map((studio) => studio.company) ?? [],
  publishers:
    igdbGame.involved_companies
      ?.filter((studio) => studio.publisher)
      .map((studio) => studio.company) ?? [],
  platform: igdbGame.platforms.find(
    (igdbPlatform) => igdbPlatform.id === gameCore.platformId
  ),
  series: igdbGame.collections?.reduce((prev, curr) =>
    curr.games.length > prev.games.length ? curr : prev
  ),
  genres: igdbGame.genres,
  cover: igdbGame.cover?.url
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
  metascore: '/games',
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
    slug: igdbItem.slug,
    hours: getTotalPlaytime(gamesCore),
    averageRating: getAverageRating(gamesCore),
    games: fullGames
  };

  return [itemInfo, igdbItem] as const;
};

export const getAverageRating = (games: GameCore[]): number | undefined => {
  const ratings: number[] = [];
  games.forEach((game) => {
    if (game.rating) ratings.push(game.rating);
  });

  return mean(ratings);
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
