import { NextRequest, NextResponse } from 'next/server';

import { UserRouteParams } from '@ts/users/user';

import { CredentialsModel, UsersModel } from '@lib/models';
import { generateErrorResponse, uniteUserData } from '@lib/utils';
import { getDashboards } from '@lib/auth';
import { generalEndpoint } from '@lib/endpoint-generators';

const getUser = async (_req: NextRequest, params?: UserRouteParams) => {
  if (!params) throw generateErrorResponse(400, 'User id was not given');
  const { userId } = await params;

  const credentials = await CredentialsModel.findOne({ userId }).lean();
  const userInfo = await UsersModel.findById(userId).lean();

  if (!credentials || !userInfo)
    throw generateErrorResponse(404, 'User was not found');

  if (!userInfo.isPublic) throw generateErrorResponse(403, 'Forbidden');

  const dashboards = await getDashboards(userId);

  return NextResponse.json(uniteUserData(credentials, userInfo, dashboards), {
    status: 200,
    statusText: `User ${credentials.username} was found`
  });
};

export const GET = generalEndpoint<UserRouteParams>(getUser);
