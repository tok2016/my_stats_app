import { Types } from 'mongoose';

import { NextRequest, NextResponse } from 'next/server';

import { IgdbBasic } from '@ts/games/api-response';
import Game, {
  GameCore,
  GameDetailed,
  IgdbGameFull,
  IgdbRecommendedGame
} from '@ts/games/game';
import { RatingDetialed, Ratings } from '@ts/games/rating';
import Token from '@ts/users/token';

import { getCredentialsById } from '@lib/auth';
import { gameEndpoint, protectedEndpoint } from '@lib/endpoint-generators';
import {
  FULL_GAME_FIELDS,
  formRecommendedGame,
  getFullGames,
  uniteGameCoreAndIgdb
} from '@lib/games/games-utils';
import { igdbRequest } from '@lib/games/igdb';
import { GamesModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { GameUpdateValidator, validateData } from '@lib/validation-schemas';

type GameIdParams = {
  gameId?: string;
};

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

const getDetialedRatings = (game: Game, otherGames: Game[]): Ratings => {
  const ratings = Object.fromEntries(
    RatingsKeys.map((key): [keyof Ratings, RatingDetialed | undefined] => [
      key,
      typeof game[key] === 'number'
        ? {
            value: game[key],
            generalPosition: 1,
            seriesPosition: game.series ? 1 : undefined
          }
        : undefined
    ])
  ) as unknown as Ratings;

  otherGames.forEach((otherGame) => {
    RatingsKeys.forEach((key) => {
      if (
        !!ratings[key]
        && typeof otherGame[key] === 'number'
        && typeof game[key] === 'number'
        && otherGame[key] > game[key]
      ) {
        ratings[key].generalPosition++;

        if (otherGame.series?.id === game.series?.id)
          ratings[key].seriesPosition = (ratings[key].seriesPosition ?? 1) + 1;
      }
    });
  });

  return ratings;
};

const getGameById = async (
  games: GameCore[],
  _req: NextRequest,
  params?: GameIdParams
) => {
  if (!params?.gameId)
    throw generateErrorResponse(400, 'Game ID was not provided');

  const gamesMap = new Map<number, GameCore>();
  let foundGame: GameCore | undefined;

  games.forEach((game) => {
    if (game.id === params.gameId) foundGame = game;
    else gamesMap.set(game.apiId, game);
  });

  if (!foundGame) throw generateErrorResponse(404, 'Game was not found');

  const foundIgdbGame = (
    await igdbRequest<IgdbGameDetailed>('/games', {
      fields: DetailedGameFields,
      where: `id = ${foundGame.apiId}`
    })
  )[0];

  if (!foundIgdbGame)
    throw generateErrorResponse(404, 'Game full data was not found');

  const otherGames = await getFullGames(gamesMap);
  const gameFull = uniteGameCoreAndIgdb(
    foundGame,
    foundIgdbGame,
    'screenshot_big',
    MAX_SCREENSHOTS_IN_GAME
  );
  const gameRatings = getDetialedRatings(gameFull, otherGames);

  return NextResponse.json(
    uniteGameAndIgdbDetailed(gameFull, gameRatings, foundIgdbGame),
    {
      status: 200,
      statusText: 'Game was found by ID'
    }
  );
};

const putGameChangesById = async (
  token: Token,
  req: NextRequest,
  params?: GameIdParams
) => {
  if (!params?.gameId)
    throw generateErrorResponse(400, 'Game ID was not provided');

  const credentials = await getCredentialsById(token.id);
  const update = await validateData(GameUpdateValidator, await req.json());

  const updatedGame = await GamesModel.updateOne(
    { userId: credentials.userId, _id: new Types.ObjectId(params.gameId) },
    update
  ).lean();

  if (!updatedGame) throw generateErrorResponse(404, 'Game was not found');

  return new NextResponse('Game was updated successfully', {
    status: 200,
    statusText: 'Game was updated successfully'
  });
};

const deleteGameById = async (
  token: Token,
  _req: NextRequest,
  params?: GameIdParams
) => {
  if (!params?.gameId)
    throw generateErrorResponse(400, 'Game ID was not provided');

  const credentials = await getCredentialsById(token.id);
  const deletedGame = await GamesModel.deleteOne({
    userId: credentials.userId,
    _id: new Types.ObjectId(params.gameId)
  });

  if (!deletedGame) throw generateErrorResponse(404, 'Game was not found');

  return new NextResponse('Game was deleted successfully', {
    status: 200,
    statusText: 'Game was deleted successfully'
  });
};

export const GET = gameEndpoint(getGameById);
export const PUT = protectedEndpoint(putGameChangesById);
export const DELETE = protectedEndpoint(deleteGameById);
