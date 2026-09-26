import { NextRequest, NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import {
  CommonUserEndpointAction,
  ConfirmationEndpointAction,
  GameEndpointAction,
  GeneralEndpointAction,
  ProtectedEndpointAction,
  ServiceEndpointAction
} from '@ts/requests';
import { ConfirmationInfo } from '@ts/users/confirmation';
import { UserRouteParams } from '@ts/users/user';

import { AppRouteHandlerRoutes } from '../../.next/types/routes';
import { tryGetCredentialsById, tryGetServicesByUserId } from './auth';
import { CredentialsModel, GamesModel, UsersModel } from './models';
import ObjectMapArray from './object-map-array';
import { tryExtractTokenFromHeader } from './token';
import { isErrorResponse } from './type-guards';
import { generateErrorResponse } from './utils';

/**
 * Forms response object with error.
 * @param error
 * @returns Response object with error.
 */
const catchErrorResponse = (error: unknown) => {
  if (isErrorResponse(error)) {
    return NextResponse.json(error, {
      status: error.status,
      statusText: error.message
    });
  }

  const errorResponse = generateErrorResponse(
    500,
    typeof error === 'string' ? error : 'Internal server error'
  );

  return NextResponse.json(errorResponse, {
    status: errorResponse.status,
    statusText: errorResponse.message
  });
};

/**
 * Checks if user with given user id exists.
 * @param userId
 * @param tokenRaw - Encoded token.
 * @throws 400 if user id was not give.
 * @throws 401 if token is expired or doesn't exit.
 * @throws 403 if token authorizes different user.
 */
const tryCheckUserAuthorRights = async (
  userId: string | undefined,
  tokenRaw: string | null
) => {
  if (!userId) {
    throw generateErrorResponse(400, 'User id was not given');
  }

  const token = await tryExtractTokenFromHeader(tokenRaw);
  const credentials = await tryGetCredentialsById(token.id);

  if (credentials.userId !== userId) {
    throw generateErrorResponse(403, 'Forbidden');
  }
};

/**
 * Public endpoint. Wraps action to catch error.
 * @param action - Route action.
 * @returns Response object with data or error.
 */
export const generalEndpoint =
  <Endpoint extends AppRouteHandlerRoutes>(
    action: GeneralEndpointAction<Endpoint>
  ) =>
  async (req: NextRequest, context: RouteContext<Endpoint>) => {
    try {
      return await action(req, context.params);
    } catch (err) {
      console.log(err);
      return catchErrorResponse(err);
    }
  };

/**
 * Protected endpoint. Authorizes user's request by token. Delivers token to action.
 * @param action - Route action.
 * @throws 401 if token is expired or doesn't exists.
 * @returns Response object with data or error.
 */
export const protectedEndpoint =
  <Endpoint extends AppRouteHandlerRoutes>(
    action: ProtectedEndpointAction<Endpoint>
  ) =>
  async (req: NextRequest, context: RouteContext<Endpoint>) => {
    try {
      const token = await req.headers.get('Authorization');
      return await action(
        req,
        context.params,
        await tryExtractTokenFromHeader(token)
      );
    } catch (err) {
      return catchErrorResponse(err);
    }
  };

const isUserParams = (params: unknown): params is UserRouteParams =>
  !!(params as UserRouteParams)?.userId;

/**
 * Protected endpoint with user id in route params. Authorizes user's request by token.
 * Checks if token authorizes user with given user id.
 * @param action - Route action.
 * @throws 400 if user id is not given.
 * @throws 401 if token is expired or doesn't exists.
 * @throws 403 if token authorizes user with different id.
 * @returns Response object with data or error.
 */
export const commonUserEndpoint =
  <Endpoint extends AppRouteHandlerRoutes>(
    action: CommonUserEndpointAction<Endpoint>
  ) =>
  async (req: NextRequest, context: RouteContext<Endpoint>) => {
    try {
      const token = await req.headers.get('Authorization');
      const params = await context.params;
      if (!isUserParams(params))
        throw generateErrorResponse(400, 'User id was not given');

      await tryCheckUserAuthorRights(params.userId, token);
      return await action(req, context.params);
    } catch (err) {
      return catchErrorResponse(err);
    }
  };

/**
 * Public endpoint with operation id in route params.
 * Awaits for updated operation data from action and forms repsonse with it.
 * @param action - Route action.
 * @returns Response object with data or error.
 */
export const confirmationEndpoint =
  <Endpoint extends AppRouteHandlerRoutes>(
    action: ConfirmationEndpointAction<Endpoint>
  ) =>
  async (req: NextRequest, context: RouteContext<Endpoint>) => {
    try {
      const operation = await action(req, context.params);

      const operationInfo: ConfirmationInfo = {
        id: operation.id,
        credential: operation.credential,
        action: operation.action,
        isConfirmed: operation.isConfirmed
      };

      return NextResponse.json(operationInfo, {
        status: 202,
        statusText: 'Confirmation operation was accepted'
      });
    } catch (err) {
      return catchErrorResponse(err);
    }
  };

/**
 * Protected endpoint. Authorizes user's request by token and finds their service credentials.
 * Delivers Steam credentials to action.
 * @param action - Route action.
 * @throws 400 if user id is not given.
 * @throws 401 if token is expired or doesn't exists.
 * @throws 403 if token authorizes user with different id.
 * @returns Response object with data or error.
 */
export const serviceEndpoint =
  <Endpoint extends AppRouteHandlerRoutes>(
    action: ServiceEndpointAction<Endpoint>
  ) =>
  async (req: NextRequest, context: RouteContext<Endpoint>) => {
    try {
      //Checks user's rights.
      const token = await req.headers.get('Authorization');
      const params = await context.params;
      if (!isUserParams(params))
        throw generateErrorResponse(400, 'User id was not given');

      await tryCheckUserAuthorRights(params.userId, token);

      //Finds service credentials.
      const services = await tryGetServicesByUserId(params.userId);
      return await action(req, context.params, services?.steam);
    } catch (err) {
      return catchErrorResponse(err);
    }
  };

/**
 * Protected endpoint. Authorizes user's request by token and finds all their games.
 * Delivers games collection to action.
 * @param action - Route action.
 * @throws 401 if token is expired or doesn't exists.
 * @throws 404 if user or games are not found.
 * @returns Response object with data or error.
 */
export const gameProtectedEndpoint =
  <Endpoint extends AppRouteHandlerRoutes>(
    action: GameEndpointAction<Endpoint>
  ) =>
  async (req: NextRequest, context: RouteContext<Endpoint>) => {
    try {
      //Finds user's credentials.
      const tokenRaw = await req.headers.get('Authorization');
      const token = await tryExtractTokenFromHeader(tokenRaw);

      const credentials = await CredentialsModel.findById(token.id).lean();
      if (!credentials) throw generateErrorResponse(404, 'User was not found');

      //Finds user's games.
      const games: GameCore[] = (
        await GamesModel.find({
          userId: credentials.userId
        }).lean()
      ).map((game) => ({
        ...game,
        id: game._id.toString()
      }));

      if (!games.length)
        throw generateErrorResponse(404, 'Games list is empty');

      return await action(
        req,
        context.params,
        new ObjectMapArray(games, 'apiId')
      );
    } catch (err) {
      return catchErrorResponse(err);
    }
  };

/**
 * Public endpoint with user id in search params.
 * Finds all games of public user with given id.
 * Delivers user's games to action.
 * @param action - Route action.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user or games are not found.
 * @returns Response object with data or error.
 */
export const gameMetricEndpoint =
  <Endpoint extends AppRouteHandlerRoutes>(
    action: GameEndpointAction<Endpoint>
  ) =>
  async (req: NextRequest, context: RouteContext<Endpoint>) => {
    try {
      //Finds user by id and checks their privacy.
      const userId = req.nextUrl.searchParams.get('userId');
      if (!userId) throw generateErrorResponse(400, 'User ID was not given');

      const user = await UsersModel.findById(userId).lean();
      if (!user) throw generateErrorResponse(404, 'User was not found');
      else if (user._id.toString() !== userId && !user.isPublic)
        throw generateErrorResponse(403, 'Forbidden');

      //Finds user's games.
      const games: GameCore[] = (await GamesModel.find({ userId }).lean()).map(
        (game) => ({
          ...game,
          id: game._id.toString()
        })
      );

      if (!games.length)
        throw generateErrorResponse(404, 'Games list is empty');

      return await action(
        req,
        context.params,
        new ObjectMapArray(games, 'apiId')
      );
    } catch (err) {
      return catchErrorResponse(err);
    }
  };
