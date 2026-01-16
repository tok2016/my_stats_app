import { NextRequest, NextResponse } from 'next/server';

import Token from '@ts/users/token';
import { UserRouteParams } from '@ts/users/user';
import Confirmation, {
  ConfirmationInfo,
  ConfirmationRouteParams
} from '@ts/users/confirmation';

import { extractToken } from './token';
import { checkUserAuthorRights } from './auth';
import { generateErrorResponse, isErrorResponse } from './utils';

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
  <ParamsType = undefined>(
    action: (req: NextRequest, params?: ParamsType) => Promise<NextResponse>
  ) =>
  async (req: NextRequest, context?: { params: Promise<ParamsType> }) => {
    try {
      const params = await context?.params;
      return action(req, params);
    } catch (err) {
      return generateAccessError(err);
    }
  };

export const protectedEndpoint =
  (action: (token: Token, req: NextRequest) => Promise<NextResponse>) =>
  async (req: NextRequest) => {
    try {
      const token = await req.headers.get('Authorization');
      return action(await extractToken(token), req);
    } catch (err) {
      return generateAccessError(err);
    }
  };

export const commonUserEndpoint =
  <ParamsType extends UserRouteParams = UserRouteParams>(
    action: (params: ParamsType, req: NextRequest) => Promise<NextResponse>
  ) =>
  async (req: NextRequest, context?: { params: Promise<ParamsType> }) => {
    try {
      const token = await req.headers.get('Authorization');
      const params = await context?.params;

      if (!params) throw generateErrorResponse(400, 'User id was not given');

      await checkUserAuthorRights(params?.userId, token);
      return action(params, req);
    } catch (err) {
      return generateAccessError(err);
    }
  };

export const confirmationEndpoint =
  <ParamsType extends ConfirmationRouteParams = ConfirmationRouteParams>(
    action: (req: NextRequest, params?: ParamsType) => Promise<Confirmation>
  ) =>
  async (req: NextRequest, context?: { params: Promise<ParamsType> }) => {
    try {
      const params = await context?.params;
      const operation = await action(req, params);

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
