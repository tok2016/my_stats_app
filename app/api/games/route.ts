import { NextRequest, NextResponse } from 'next/server';

import { GamesFilter } from '@ts/games/filter';
import Game, { GameCore, GameTableData, GamesTablePage } from '@ts/games/game';
import { IgdbImage } from '@ts/games/image';
import Token from '@ts/users/token';
import { LiteralType } from '@ts/util-types';

import { getCredentialsById } from '@lib/auth';
import { gameEndpoint, protectedEndpoint } from '@lib/endpoint-generators';
import { getFullGames } from '@lib/games/games-utils';
import { igdbRequest } from '@lib/games/igdb';
import { GamesModel } from '@lib/models';
import { generateErrorResponse, parseBooleanString } from '@lib/utils';
import { NewGameValidator, validateData } from '@lib/validation-schemas';

const GAMES_PER_PAGE = 20;

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
    !!game.releasedAt && game.releasedAt.getTime() >= new Date(query).getTime(),
  releaseTo: (game, query) =>
    !!game.releasedAt && game.releasedAt.getTime() <= new Date(query).getTime(),
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
    !!game.playDate && game.playDate.getTime() >= new Date(query).getTime(),
  playDateTo: (game, query) =>
    !!game.playDate && game.playDate.getTime() <= new Date(query).getTime(),
  hoursFrom: (game, query) =>
    typeof game.hours === 'number' && game.hours >= Number(query),
  hoursTo: (game, query) =>
    typeof game.hours === 'number' && game.hours <= Number(query),
  sort: () => true,
  direction: () => true,
  page: () => true
};

const sortByFilter: Record<keyof GameTableData, (a: Game, b: Game) => number> =
  {
    index: (a, b) => (a.rating ?? 0) - (b.rating ?? 0),
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
      (a.playDate?.getTime() ?? 0) - (b.playDate?.getTime() ?? 0),
    releasedAt: (a, b) =>
      (a.releasedAt?.getTime() ?? 0) - (b.releasedAt?.getTime() ?? 0),
    genres: (a, b) =>
      a.genres[0]?.name.localeCompare(b.genres[0]?.name ?? '') ?? 0,
    hours: (a, b) => a.hours - b.hours,
    cover: () => 0,
    screenshots: () => 0
  };

const getGames = async (games: GameCore[], req: NextRequest) => {
  const gamesMap = new Map<number, GameCore>(
    games.map((game) => [game.apiId, game])
  );

  const allGames = await getFullGames(gamesMap);
  const filters = req.nextUrl.searchParams.entries().toArray();
  let maxHours = 0;

  const filtersObj: GamesFilter = Object.fromEntries(filters);
  const filteredGames = allGames.filter((game) => {
    maxHours = game.hours > maxHours ? game.hours : maxHours;
    return filters.every(
      ([key, value]) => !value || filterByField[key]?.(game, value)
    );
  });

  const direction = filtersObj.direction === 'asc' ? 1 : -1;
  const sortFields: NonNullable<GamesFilter['sort']>[] = [
    'hours',
    filtersObj.sort ?? 'index'
  ];

  filteredGames.sort(
    (a, b) =>
      direction
      * sortFields
        .map((field) => sortByFilter[field]?.(a, b) ?? 1)
        .reduce((prev, curr) => prev + curr, 0)
  );

  const parsedPage = parseInt(filtersObj.page ?? '1');
  const page = !parsedPage ? 1 : parsedPage;

  const startIndex = (page - 1) * GAMES_PER_PAGE;

  const gamesPage: GamesTablePage = {
    startIndex,
    currentPage: page,
    games: filteredGames.slice(startIndex, page * GAMES_PER_PAGE),
    pagesCount: Math.ceil(filteredGames.length / GAMES_PER_PAGE),
    maxHours
  };

  return NextResponse.json(gamesPage, {
    status: 200,
    statusText: 'Games library was filtered and sorted'
  });
};

const postNewGame = async (token: Token, req: NextRequest) => {
  const credentials = await getCredentialsById(token.id);
  if (!credentials)
    throw generateErrorResponse(404, 'Credentials were not found');

  const newGame = await validateData(NewGameValidator, await req.json());
  const currentGame = await GamesModel.find({ apiId: newGame.apiId }).lean();

  if (!!currentGame[0])
    throw generateErrorResponse(400, 'This game was already added');

  await GamesModel.create({ ...newGame, userId: credentials.userId });

  return new NextResponse('New game was added successfully', {
    status: 201,
    statusText: 'New game was added successfully'
  });
};

type GameCover = {
  id: number;
  cover?: IgdbImage;
};

const changeCovers = async (token: Token) => {
  const credentials = await getCredentialsById(token.id);
  const gamesCore = await GamesModel.find({
    userId: credentials.userId
  }).lean();

  const gamesCovers = await igdbRequest<GameCover>('/games', {
    fields: ['cover.image_id'],
    where: `id = (${gamesCore.map((game) => game.apiId).join(',')})`,
    limit: gamesCore.length
  });

  const promises = gamesCovers.map((cover) => {
    return GamesModel.findOneAndUpdate(
      { apiId: cover.id },
      { cover: cover.cover?.image_id }
    );
  });

  await Promise.all(promises);

  const updatedGamesCore = await GamesModel.find({
    userId: credentials.userId
  }).lean();

  return NextResponse.json(updatedGamesCore, {
    status: 200,
    statusText: 'Games covers url were replaced with cover image id'
  });
};

export const GET = gameEndpoint(getGames);
export const POST = protectedEndpoint(postNewGame);
export const PUT = protectedEndpoint(changeCovers);
