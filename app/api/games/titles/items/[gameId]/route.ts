import { Types } from 'mongoose';

import { NextResponse } from 'next/server';

import { IgdbBasic } from '@ts/games/api-response';
import Game, {
  GameDetailed,
  IgdbGameFull,
  IgdbRecommendedGame
} from '@ts/games/game';
import { RatingDetialed, Ratings } from '@ts/games/rating';
import { GameEndpointAction, ProtectedEndpointAction } from '@ts/requests';

import { tryGetCredentialsById } from '@lib/auth';
import {
  gameProtectedEndpoint,
  protectedEndpoint
} from '@lib/endpoint-generators';
import {
  FULL_GAME_FIELDS,
  formRecommendedGame,
  getFullGames,
  uniteGameCoreAndIgdb
} from '@lib/games/games-utils';
import { igdbRequest } from '@lib/games/igdb';
import { GamesModel } from '@lib/models';
import ObjectMapArray from '@lib/object-map-array';
import { generateErrorResponse } from '@lib/utils';
import { GameUpdateValidator, validateData } from '@lib/validation-schemas';

type IgdbGameDetailed = IgdbGameFull & {
  themes?: IgdbBasic[];
  similar_games?: IgdbRecommendedGame[];
};

const MAX_SCREENSHOTS_IN_GAME = 15;

const DetailedGameFields = [
  ...FULL_GAME_FIELDS,
  'themes.id',
  'themes.name',
  'similar_games.id',
  'similar_games.name',
  'similar_games.cover.image_id',
  'similar_games.external_games.id',
  'similar_games.external_games.url',
  'similar_games.external_games.external_game_source.id',
  'similar_games.external_games.external_game_source.name',
  'similar_games.external_games.game_release_format',
  'similar_games.genres.id',
  'similar_games.genres.name',
  'similar_games.screenshots.image_id',
  'similar_games.rating'
];

const RatingsKeys: (keyof Ratings)[] = [
  'hours',
  'rating',
  'criticsRating',
  'usersRating'
];

const uniteGameAndIgdbDetailed = (
  game: Game,
  ratings: Ratings,
  igdbGame: IgdbGameDetailed
): GameDetailed => {
  return {
    ...game,
    hours: ratings.hours,
    rating: ratings.rating,
    criticsRating: ratings.criticsRating,
    usersRating: ratings.usersRating,
    themes: igdbGame.themes ?? [],
    platforms: igdbGame.platforms,
    similarGames: igdbGame.similar_games?.map(formRecommendedGame) ?? []
  };
};

/**
 * Calculates position / rank of game in games and series list by ratings.
 * @param game - Game data.
 * @param otherGames - Other games without given game.
 * @returns Ratings values with positions.
 */
const getDetialedRatings = (
  game: Game,
  otherGames: ObjectMapArray<Game, 'id'>
): Ratings => {
  //Fillds ratings fields with default positions.
  const ratings = new Map<keyof Ratings, RatingDetialed | undefined>(
    RatingsKeys.map((key) => [
      key,
      typeof game[key] === 'number'
        ? {
            value: game[key],
            generalPosition: 1,
            seriesPosition: game.series ? 1 : undefined
          }
        : undefined
    ])
  );

  //Calculates positions.
  otherGames.forEach((otherGame) => {
    RatingsKeys.forEach((key) => {
      const rating = ratings.get(key);
      if (
        typeof rating !== 'undefined'
        && typeof otherGame[key] === 'number'
        && typeof game[key] === 'number'
        && otherGame[key] > game[key]
      ) {
        rating.generalPosition++;
        if (otherGame.series?.id === game.series?.id)
          rating.seriesPosition = (rating.seriesPosition ?? 1) + 1;
      }
    });
  });

  return Object.fromEntries(ratings.entries()) as never as Ratings;
};

/**
 * Protected method. Fetches detailed data of game of given id.
 * @param _req - Request object.
 * @param params - Route params with game id.
 * @param games - All games of user.
 * @throws 400 if game id is not given.
 * @throws 404 if no game of user is found.
 * @returns Detailed data of game.
 */
const getGameById: GameEndpointAction<
  '/api/games/titles/items/[gameId]'
> = async (_req, params, games) => {
  //Finds game with given id.
  const { gameId } = await params;
  if (!gameId) throw generateErrorResponse(400, 'Game ID was not provided');

  const foundGame = games.find((game) => game.id === gameId);
  if (!foundGame) throw generateErrorResponse(404, 'Game was not found');

  //Fetches game detailed data form IGDB.
  const foundIgdbGame = (
    await igdbRequest<IgdbGameDetailed>('/games', {
      fields: DetailedGameFields,
      where: `id = ${foundGame.apiId}`
    })
  )[0];

  if (!foundIgdbGame)
    throw generateErrorResponse(404, 'Game data was not found');

  const gameFull = uniteGameCoreAndIgdb(
    foundGame,
    foundIgdbGame,
    'screenshot_big',
    MAX_SCREENSHOTS_IN_GAME
  );

  //Calculates game positions in ratings and playtime list.
  const otherGames = await getFullGames(games);
  const gameRatings = getDetialedRatings(gameFull, otherGames);

  return NextResponse.json(
    uniteGameAndIgdbDetailed(gameFull, gameRatings, foundIgdbGame),
    {
      status: 200,
      statusText: 'Game was found by ID'
    }
  );
};

/**
 * Protected endpoint. Updates game data by id.
 * @param req - Request object with updated data.
 * @param params - Route params with game id.
 * @param token - Token object.
 * @throws 400 if updated data is invalid or game id is not given.
 * @throws 404 if user or game are not found.
 * @returns Response object
 */
const putGameChangesById: ProtectedEndpointAction<
  '/api/games/titles/items/[gameId]'
> = async (req, params, token) => {
  //Validates game update data.
  const { gameId } = await params;
  if (!gameId) throw generateErrorResponse(400, 'Game ID was not provided');

  const update = await validateData(GameUpdateValidator, await req.json());

  //Stores updated data.
  const credentials = await tryGetCredentialsById(token.id);

  const updatedGame = await GamesModel.updateOne(
    { userId: credentials.userId, _id: new Types.ObjectId(gameId) },
    update
  ).lean();

  if (!updatedGame) throw generateErrorResponse(404, 'Game was not found');

  return new NextResponse('Game was updated successfully', {
    status: 200,
    statusText: 'Game was updated successfully'
  });
};

/**
 * Protected endpoint. Deletes game data by id.
 * @param _req - Request object.
 * @param params - Route params with game id.
 * @param token - Token object.
 * @throws 400 if game id is not given.
 * @throws 404 if user or game are not found.
 * @returns Response object
 */
const deleteGameById: ProtectedEndpointAction<
  '/api/games/titles/items/[gameId]'
> = async (_req, params, token) => {
  const { gameId } = await params;
  if (!gameId) throw generateErrorResponse(400, 'Game ID was not provided');

  const credentials = await tryGetCredentialsById(token.id);
  const deletedGame = await GamesModel.deleteOne({
    userId: credentials.userId,
    _id: new Types.ObjectId(gameId)
  });

  if (!deletedGame) throw generateErrorResponse(404, 'Game was not found');

  return new NextResponse('Game was deleted successfully', {
    status: 200,
    statusText: 'Game was deleted successfully'
  });
};

export const GET = gameProtectedEndpoint(getGameById);
export const PUT = protectedEndpoint(putGameChangesById);
export const DELETE = protectedEndpoint(deleteGameById);
