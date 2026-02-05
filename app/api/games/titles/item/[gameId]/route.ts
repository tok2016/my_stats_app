import { Types } from 'mongoose';

import { NextRequest, NextResponse } from 'next/server';

import { IgdbGameFull } from '@ts/games/game';
import Token from '@ts/users/token';

import { getCredentialsById } from '@lib/auth';
import { protectedEndpoint } from '@lib/endpoint-generators';
import { FULL_GAME_FIELDS, uniteGameCoreAndIgdb } from '@lib/games-utils';
import { igdbRequest } from '@lib/igdb';
import { GamesModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { GameUpdateValidator, validateData } from '@lib/validation-schemas';

type GameIdParams = {
  gameId?: string;
};

const getGameById = async (
  token: Token,
  _req: NextRequest,
  params?: GameIdParams
) => {
  if (!params?.gameId)
    throw generateErrorResponse(400, 'Game ID was not provided');

  const credentials = await getCredentialsById(token.id);
  const gameCore = (
    await GamesModel.find({
      userId: credentials.userId,
      _id: new Types.ObjectId(params.gameId)
    }).lean()
  )[0];

  if (!gameCore) throw generateErrorResponse(404, 'Game was not found');

  const igdbGame = (
    await igdbRequest<IgdbGameFull>('/games', {
      fields: FULL_GAME_FIELDS,
      where: `id = ${gameCore.apiId}`
    })
  )[0];

  if (!igdbGame)
    throw generateErrorResponse(404, 'Game full data was not found');

  const gameFull = uniteGameCoreAndIgdb(
    { ...gameCore, id: gameCore._id.toString() },
    igdbGame
  );
  return NextResponse.json(gameFull, {
    status: 200,
    statusText: 'Game was found by ID'
  });
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

export const GET = protectedEndpoint(getGameById);
export const PUT = protectedEndpoint(putGameChangesById);
export const DELETE = protectedEndpoint(deleteGameById);
