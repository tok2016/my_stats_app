import { NextResponse } from 'next/server';

import { GeneralEndpointAction } from '@ts/requests';

import { getDashboards } from '@lib/auth';
import { generalEndpoint } from '@lib/endpoint-generators';
import { CredentialsModel, UsersModel } from '@lib/models';
import { generateErrorResponse, uniteUserData } from '@lib/utils';

const getUser: GeneralEndpointAction<'/api/user/[userId]'> = async (
  _req,
  params
) => {
  const { userId } = await params;
  if (!userId) throw generateErrorResponse(400, 'User id was not given');

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

export const GET = generalEndpoint(getUser);
