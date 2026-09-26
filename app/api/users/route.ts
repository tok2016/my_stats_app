import { RootFilterQuery } from 'mongoose';

import { NextResponse } from 'next/server';

import { GeneralEndpointAction } from '@ts/requests';
import { User, UserInfo } from '@ts/users/user';

import { generalEndpoint } from '@lib/endpoint-generators';
import { CredentialsModel, UsersModel } from '@lib/models';
import { generateErrorResponse, uniteUserData } from '@lib/utils';

/** Public method. Filters public users by email or username.
 * @param req - Request object.
 * @throws 404 if none of users is found.
 * @returns Filtered array of public users. */
const getUsers: GeneralEndpointAction<'/api/users'> = async (req) => {
  //Parses search params.
  const credentialSearch = req.nextUrl.searchParams.get('credential');
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '0');

  if (!credentialSearch) {
    return NextResponse.json([], {
      status: 200,
      statusText: 'No users were found'
    });
  }

  //Searches for credentials objects with query in username or email.
  const regex = new RegExp(credentialSearch.toLowerCase().trim(), 'i');
  const credentials = await CredentialsModel.find({
    $or: [{ username: regex }, { email: regex }]
  }).lean();

  //Maps credentials data with user id.
  const credentialsMap = new Map(
    credentials.map((credential) => [credential.userId, credential])
  );

  //Searches for users data by id and limits it.
  const usersQuery: RootFilterQuery<UserInfo> = {
    _id: {
      $in: credentialsMap.keys().toArray()
    },
    isPublic: true
  };

  const usersInfo = limit
    ? await UsersModel.find(usersQuery).limit(limit).lean()
    : await UsersModel.find(usersQuery).lean();

  if (!usersInfo.length) {
    throw generateErrorResponse(
      404,
      `Users with ${credentialSearch} username or email were not found`,
      'Users were not found'
    );
  }

  //Unites credential and users data.
  const unitedUsers: User[] = usersInfo
    .map((userInfo) => {
      const credentials = credentialsMap.get(userInfo._id.toString());
      return credentials ? uniteUserData(credentials, userInfo) : undefined;
    })
    .filter((user) => !!user);

  return NextResponse.json(unitedUsers, {
    status: 200,
    statusText: 'Users were found'
  });
};

export const GET = generalEndpoint(getUsers);
