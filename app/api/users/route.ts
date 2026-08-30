import { RootFilterQuery } from 'mongoose';

import { NextResponse } from 'next/server';

import { GeneralEndpointAction } from '@ts/requests';
import { CredentialsInSchema } from '@ts/users/credentials';
import { User, UserInfo } from '@ts/users/user';

import { generalEndpoint } from '@lib/endpoint-generators';
import { CredentialsModel, UsersModel } from '@lib/models';
import { uniteUserData } from '@lib/utils';

const getUsers: GeneralEndpointAction<'/api/users'> = async (req) => {
  const credentialSearch = req.nextUrl.searchParams.get('credential');
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '0');

  if (!credentialSearch) {
    return NextResponse.json([], {
      status: 200,
      statusText: 'No users were found'
    });
  }

  const regex = new RegExp(credentialSearch.toLowerCase().trim(), 'i');
  const credentials = await CredentialsModel.find({
    $or: [{ username: regex }, { email: regex }]
  }).lean();

  const credentialsMap: { [key: string]: CredentialsInSchema } =
    Object.fromEntries(
      credentials.map((credential) => [credential.userId, credential])
    );

  const usersQuery: RootFilterQuery<UserInfo> = {
    _id: { $in: Object.keys(credentialsMap) },
    isPublic: true
  };

  const usersInfo = limit
    ? await UsersModel.find(usersQuery).limit(limit).lean()
    : await UsersModel.find(usersQuery).lean();

  const unitedUsers: User[] = usersInfo.map((userInfo) =>
    uniteUserData(credentialsMap[userInfo._id.toString()], userInfo)
  );

  return NextResponse.json(unitedUsers, {
    status: 200,
    statusText: 'Users were found'
  });
};

export const GET = generalEndpoint(getUsers);
