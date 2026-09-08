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
import { ServicesMap } from '@ts/users/service';
import { UserRouteParams } from '@ts/users/user';

import { AppRouteHandlerRoutes } from '../../.next/types/routes';
import { checkUserAuthorRights } from './auth';
import {
  CredentialsModel,
  GamesModel,
  ServiceCredentialsModel,
  UsersModel
} from './models';
import ObjectMapArray from './object-map-array';
import { extractToken } from './token';
import { isErrorResponse } from './type-guards';
import { generateErrorResponse } from './utils';

const getServicesByCredentialsId = async (id: string): Promise<ServicesMap> => {
  const credentials = await CredentialsModel.findById(id).lean();

  if (!credentials)
    throw generateErrorResponse(404, 'Credentials were not found');

  const services = await ServiceCredentialsModel.find({
    userId: credentials.userId
  }).lean();

  const entries = services.map((service) => [
    service.name,
    {
      ...service,
      id: service._id.toString()
    }
  ]);

  return Object.fromEntries(entries);
};

const generateAccessError = (error: unknown) => {
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

export const generalEndpoint =
  <Endpoint extends AppRouteHandlerRoutes>(
    action: GeneralEndpointAction<Endpoint>
  ) =>
  async (req: NextRequest, context: RouteContext<Endpoint>) => {
    try {
      return await action(req, context.params);
    } catch (err) {
      return generateAccessError(err);
    }
  };

export const protectedEndpoint =
  <Endpoint extends AppRouteHandlerRoutes>(
    action: ProtectedEndpointAction<Endpoint>
  ) =>
  async (req: NextRequest, context: RouteContext<Endpoint>) => {
    try {
      const token = await req.headers.get('Authorization');
      return await action(req, context.params, await extractToken(token));
    } catch (err) {
      return generateAccessError(err);
    }
  };

const isUserParams = (params: unknown): params is UserRouteParams =>
  !!(params as UserRouteParams)?.userId;

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

      await checkUserAuthorRights(params.userId, token);
      return await action(req, context.params);
    } catch (err) {
      return generateAccessError(err);
    }
  };

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
      return generateAccessError(err);
    }
  };

export const serviceEndpoint =
  <Endpoint extends AppRouteHandlerRoutes>(
    action: ServiceEndpointAction<Endpoint>
  ) =>
  async (req: NextRequest, context: RouteContext<Endpoint>) => {
    try {
      const tokenRaw = await req.headers.get('Authorization');
      const token = await extractToken(tokenRaw);
      const services = await getServicesByCredentialsId(token.id);

      return await action(req, context.params, services?.steam);
    } catch (err) {
      return generateAccessError(err);
    }
  };

export const gameProtectedEndpoint =
  <Endpoint extends AppRouteHandlerRoutes>(
    action: GameEndpointAction<Endpoint>
  ) =>
  async (req: NextRequest, context: RouteContext<Endpoint>) => {
    try {
      const tokenRaw = await req.headers.get('Authorization');
      const token = await extractToken(tokenRaw);

      const credentials = await CredentialsModel.findById(token.id).lean();

      if (!credentials)
        throw generateErrorResponse(404, 'Credentials were not found');

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
      return generateAccessError(err);
    }
  };

export const gameMetricEndpoint =
  <Endpoint extends AppRouteHandlerRoutes>(
    action: GameEndpointAction<Endpoint>
  ) =>
  async (req: NextRequest, context: RouteContext<Endpoint>) => {
    try {
      const userId = req.nextUrl.searchParams.get('userId');

      if (!userId) throw generateErrorResponse(400, 'User ID was not given');

      const user = await UsersModel.findById(userId).lean();

      if (!user) throw generateErrorResponse(404, 'User was not found');
      else if (user._id.toString() !== userId && !user.isPublic)
        throw generateErrorResponse(403, 'Forbidden');

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
      return generateAccessError(err);
    }
  };
