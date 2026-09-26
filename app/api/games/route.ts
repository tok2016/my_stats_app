import { NextResponse } from 'next/server';

import { GamesFilter } from '@ts/games/filter';
import Game, { GameTableData, GamesTablePageResponse } from '@ts/games/game';
import { GameEndpointAction, ProtectedEndpointAction } from '@ts/requests';
import { LiteralType } from '@ts/util-types';

import { tryGetCredentialsById } from '@lib/auth';
import {
  gameMetricEndpoint,
  protectedEndpoint
} from '@lib/endpoint-generators';
import { getFullGames } from '@lib/games/games-utils';
import { GamesModel } from '@lib/models';
import { generateErrorResponse, parseBooleanString } from '@lib/utils';
import { NewGameValidator, validateData } from '@lib/validation-schemas';

/**
 * Filter predicates by field.
 */
const filterByField: Record<
  LiteralType<keyof GamesFilter>,
  (game: Game, query: string) => boolean
> = {
  name: (game, query) => game.name.toLowerCase().includes(query),
  series: (game, query) =>
    !!game.series && game.series.name.toLowerCase().includes(query),
  developer: (game, query) =>
    !!game.developers
    && game.developers.some((developer) =>
      developer.name.toLowerCase().includes(query)
    ),
  publisher: (game, query) =>
    !!game.publishers
    && game.publishers.some((publisher) =>
      publisher.name.toLowerCase().includes(query)
    ),
  platform: (game, query) =>
    !!game.platform && game.platform.name.toLowerCase().includes(query),
  genre: (game, query) =>
    !!game.genres
    && game.genres.some((genre) => genre.name.toLowerCase().includes(query)),
  releaseFrom: (game, query) =>
    !!game.releasedAt
    && new Date(game.releasedAt).getTime() >= new Date(query).getTime(),
  releaseTo: (game, query) =>
    !!game.releasedAt
    && new Date(game.releasedAt).getTime() <= new Date(query).getTime(),
  ratingFrom: (game, query) =>
    typeof game.rating === 'number' && game.rating >= Number(query),
  ratingTo: (game, query) =>
    typeof game.rating === 'number' && game.rating <= Number(query),
  showRating: (game, query) =>
    typeof game.rating !== 'undefined' && parseBooleanString(query),
  criticsRatingFrom: (game, query) =>
    typeof game.criticsRating === 'number'
    && game.criticsRating >= Number(query),
  criticsRatingTo: (game, query) =>
    typeof game.criticsRating === 'number'
    && game.criticsRating <= Number(query),
  showCriticsRating: (game, query) =>
    typeof game.criticsRating !== 'undefined' && parseBooleanString(query),
  usersRatingFrom: (game, query) =>
    typeof game.usersRating === 'number' && game.usersRating >= Number(query),
  usersRatingTo: (game, query) =>
    typeof game.usersRating === 'number' && game.usersRating <= Number(query),
  showUsersRating: (game, query) =>
    typeof game.usersRating !== 'undefined' && parseBooleanString(query),
  playDateFrom: (game, query) =>
    !!game.playDate
    && new Date(game.playDate).getTime() >= new Date(query).getTime(),
  playDateTo: (game, query) =>
    !!game.playDate
    && new Date(game.playDate).getTime() <= new Date(query).getTime(),
  hoursFrom: (game, query) =>
    typeof game.hours === 'number' && game.hours >= Number(query),
  hoursTo: (game, query) =>
    typeof game.hours === 'number' && game.hours <= Number(query),
  sort: () => true,
  direction: () => true,
  page: () => true,
  limit: () => true
};

/**
 * Sort callbacks by field.
 */
const sortByFilter: Record<keyof GameTableData, (a: Game, b: Game) => number> =
  {
    index: (a, b) => {
      const diff = (a.rating ?? 0) - (b.rating ?? 0);
      if (!diff) return a.hours - b.hours;
      return diff;
    },
    percent: () => 0,
    id: (a, b) => a.id.localeCompare(b.id),
    apiId: (a, b) => a.apiId - b.apiId,
    name: (a, b) => a.name.localeCompare(b.name),
    series: (a, b) => a.series?.name.localeCompare(b.series?.name ?? '') ?? 0,
    developers: (a, b) =>
      a.developers[0]?.name.localeCompare(b.developers[0].name ?? '') ?? 0,
    publishers: (a, b) =>
      a.publishers[0]?.name.localeCompare(b.publishers[0].name ?? '') ?? 0,
    platform: (a, b) =>
      a.platform?.name.localeCompare(b.platform?.name ?? '') ?? 0,
    rating: (a, b) => (a.rating ?? 0) - (b.rating ?? 0),
    criticsRating: (a, b) => (a.criticsRating ?? 0) - (b.criticsRating ?? 0),
    usersRating: (a, b) => (a.usersRating ?? 0) - (b.usersRating ?? 0),
    playDate: (a, b) =>
      new Date(a.playDate ?? 0).getTime() - new Date(b.playDate ?? 0).getTime(),
    releasedAt: (a, b) =>
      new Date(a.releasedAt ?? 0).getTime()
      - new Date(b.releasedAt ?? 0).getTime(),
    genres: (a, b) =>
      a.genres[0]?.name.localeCompare(b.genres[0]?.name ?? '') ?? 0,
    hours: (a, b) => a.hours - b.hours,
    coverUrl: () => 0,
    screenshots: () => 0
  };

/**
 * Public method. Filters all games of found user. If no filter is defined, returns all games.
 * @param req - Request object with filters params.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Filtered games data with page and offset data.
 */
const getGames: GameEndpointAction<'/api/games'> = async (
  req,
  _params,
  games
) => {
  //Fetches full games data.
  const allGames = await getFullGames(games);

  //Filters games by each given filter and calculates max playtime among all games.
  const filters = req.nextUrl.searchParams.entries().toArray();
  let maxHours = 0;

  const filtersObj: GamesFilter = Object.fromEntries(filters);
  const filteredGames = allGames.filter((game) => {
    maxHours = game.hours > maxHours ? game.hours : maxHours;
    return filters.every(
      ([key, value]) =>
        !value || !filterByField[key] || filterByField[key](game, value)
    );
  });

  //Sorts filtered games by given field.
  const direction = filtersObj.direction === 'asc' ? 1 : -1;
  filteredGames.sort(
    (a, b) => direction * sortByFilter[filtersObj.sort ?? 'index'](a, b)
  );

  //Limits games by pages.
  const parsedPage = parseInt(filtersObj.page ?? '1');
  const page = Number.isNaN(parsedPage) || !parsedPage ? 1 : parsedPage;
  const parsedLimit = parseInt(filtersObj.limit ?? '');
  const limit =
    Number.isNaN(parsedLimit) || !parsedLimit
      ? !filteredGames.count
        ? 1
        : filteredGames.count
      : parsedLimit;

  const startIndex = (page - 1) * limit;

  const gamesPage: GamesTablePageResponse = {
    startIndex,
    currentPage: page,
    games: filteredGames.slice(startIndex, page * limit).toArray(),
    pagesCount: Math.ceil(filteredGames.count / limit),
    maxHours
  };

  return NextResponse.json(gamesPage, {
    status: 200,
    statusText: 'Games library was filtered and sorted'
  });
};

/**
 * Protected method. Adds new game for current user.
 * @param req - Request body with game data.
 * @param _params - Route params.
 * @param token - Token object.
 * @throws 400 if game data is invalid or it is already stored.
 * @throws 404 if user not found.
 * @returns Response object.
 */
const postNewGame: ProtectedEndpointAction<'/api/games'> = async (
  req,
  _params,
  token
) => {
  //Validates game data and checks it existance in current user's collection.
  const newGame = await validateData(NewGameValidator, await req.json());
  const currentGame = await GamesModel.find({ apiId: newGame.apiId }).lean();

  if (!!currentGame[0])
    throw generateErrorResponse(400, 'This game was already added');

  //Stores new game for current user.
  const credentials = await tryGetCredentialsById(token.id);
  if (!credentials) throw generateErrorResponse(404, 'User was not found');

  await GamesModel.create({ ...newGame, userId: credentials.userId });

  return new NextResponse('New game was added successfully', {
    status: 201,
    statusText: 'New game was added successfully'
  });
};

export const GET = gameMetricEndpoint(getGames);
export const POST = protectedEndpoint(postNewGame);
