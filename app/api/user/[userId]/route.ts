import { NextResponse } from 'next/server';

import { GeneralEndpointAction } from '@ts/requests';

import { generalEndpoint } from '@lib/endpoint-generators';
import { CredentialsModel, UsersModel } from '@lib/models';
import { generateErrorResponse, uniteUserData } from '@lib/utils';

/**
 * Public method. Finds user by user id in route path.
 * @param _req - Request object.
 * @param params - Route params with user id.
 * @throws 400 if user id was not given in path.
 * @throws 403 if user is private.
 * @throws 404 if user is not found.
 * @returns User with given id.
 */
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

  if (!userInfo.isPublic)
    throw generateErrorResponse(403, 'User profile is private');

  return NextResponse.json(uniteUserData(credentials, userInfo), {
    status: 200,
    statusText: `User ${credentials.username} was found`
  });
};

export const GET = generalEndpoint(getUser);
