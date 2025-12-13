import { RootFilterQuery } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { CredentialsInSchema } from '@ts/users/credentials';
import { BasicUser, UserInfo } from '@ts/users/user';

import { CredentialsModel, UsersModel } from '@lib/models';
import { uniteBasicUserData } from '@lib/utils';

export async function GET(req: NextRequest) {
  const credentialSearch = req.nextUrl.searchParams.get('credential');
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '0');

  if (!credentialSearch) {
    return NextResponse.json([], {
      status: 200,
      statusText: 'No users were found'
    });
  }

  const regex = new RegExp(credentialSearch.trim(), 'i');
  const credentials = await CredentialsModel.find({
    $or: [{ username: regex }, { email: regex }]
  }).lean();

  const credentialsMap: { [key: string]: CredentialsInSchema } =
    Object.fromEntries(
      credentials.map((credential) => [credential.userId, credential])
    );

  const usersQuery: RootFilterQuery<UserInfo> = {
    _id: { $in: Object.keys(credentialsMap) }
  };
  const publicQuery: RootFilterQuery<UserInfo> = { isPublic: true };

  const usersInfo = limit
    ? await UsersModel.find(usersQuery, publicQuery).limit(limit).lean()
    : await UsersModel.find(usersQuery, publicQuery).lean();

  const unitedUsers: BasicUser[] = usersInfo.map((userInfo) =>
    uniteBasicUserData(credentialsMap[userInfo._id.toString()], userInfo)
  );

  return NextResponse.json(unitedUsers, {
    status: 200,
    statusText: 'Users were found'
  });
}
