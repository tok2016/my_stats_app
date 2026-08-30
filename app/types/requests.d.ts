import { $ZodIssue } from 'zod/v4/core';

import { NextRequest } from 'next/server';

import ObjectMapArray from '@lib/object-map-array';

import { AppRouteHandlerRoutes } from '../../.next/types/routes';
import { GameCore } from './games/game';

export type ValidationIssue = $ZodIssue;

export default interface ErrorResponse {
  status: number;
  message: string;
  issues: ValidationIssue[];
}

export type GeneralEndpointAction<Endpoint extends AppRouteHandlerRoutes> = (
  req: NextRequest,
  params: RouteContext<Endpoint>['params']
) => Promise<NextResponse>;

export type ProtectedEndpointAction<Endpoint extends AppRouteHandlerRoutes> = (
  req: NextRequest,
  params: RouteContext<Endpoint>['params'],
  token: Token
) => Promise<NextResponse>;

export type CommonUserEndpointAction<Endpoint extends AppRouteHandlerRoutes> = (
  req: NextRequest,
  params: RouteContext<Endpoint>['params']
) => Promise<NextResponse>;

export type ConfirmationEndpointAction<Endpoint extends AppRouteHandlerRoutes> =
  (
    req: NextRequest,
    params: RouteContext<Endpoint>['params']
  ) => Promise<Confirmation>;

export type ServiceEndpointAction<Endpoint extends AppRouteHandlerRoutes> = (
  req: NextRequest,
  params: RouteContext<Endpoint>['params'],
  service?: Service
) => Promise<NextResponse>;

export type GameEndpointAction<Endpoint extends AppRouteHandlerRoutes> = (
  req: NextRequest,
  params: RouteContext<Endpoint>['params'],
  games: ObjectMapArray<GameCore, 'apiId'>
) => Promise<NextResponse>;
