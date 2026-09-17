import { unlink, writeFile } from 'node:fs/promises';
import path from 'path';
import { v4 } from 'uuid';

import { NextResponse } from 'next/server';

import { CommonUserEndpointAction } from '@ts/requests';
import Avatar from '@ts/users/avatar';

import { AVATAR_DIRECTORY } from '@lib/auth';
import { commonUserEndpoint } from '@lib/endpoint-generators';
import { UsersModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';

/**
 * Protected method. Updates avatar by user id in route params.
 * @param req - Request object with avatar file.
 * @param params - Route params with user id.
 * @throws 400 if file format is invalid.
 * @throws 403 if user id contradicts the user who sent the request.
 * @throws 404 if user is not found.
 * @returns ID of new avatar.
 */
const postAvatar: CommonUserEndpointAction<
  '/api/user/[userId]/avatar'
> = async (req, params) => {
  //Finds user data by id.
  const { userId } = await params;
  const user = await UsersModel.findById(userId).lean();

  if (!user) throw generateErrorResponse(404, 'User was not found');

  //Validates avatar image file.
  const avatarRaw = (await req.formData()).get('avatar') as Blob | null;
  if (!avatarRaw || !avatarRaw.type.includes('image'))
    throw generateErrorResponse(400, 'Invalid file format');

  //Deletes previously stored avatar file.
  try {
    if (user.avatarUrl) {
      await unlink(path.join(AVATAR_DIRECTORY, user.avatarUrl));
    }
  } catch {}

  //Generates avatar id and stores its file.
  const fileName = `${v4()}.${avatarRaw.type.split('/').at(-1) ?? 'png'}`;
  const avatar = new File([avatarRaw], fileName, { type: avatarRaw.type });

  await writeFile(
    path.join(AVATAR_DIRECTORY, fileName),
    Buffer.from(await avatar.arrayBuffer())
  );

  await UsersModel.findByIdAndUpdate(
    user._id.toString(),
    { avatarUrl: fileName },
    { new: true }
  );

  const avatarData = { url: fileName } as Avatar;
  return NextResponse.json(avatarData, {
    status: 201,
    statusText: 'New avatar was saved'
  });
};

/**
 * Protected method. Deletes avatar by user id.
 * @param _req - Request object.
 * @param params - Route params with user id.
 * @throws 404 if user is not found or they don't have it.
 * @throws 403 if user id contradicts the user who sent the request.
 * @returns Response object.
 */
const deleteAvatar: CommonUserEndpointAction<
  '/api/user/[userId]/avatar'
> = async (_req, params) => {
  //Finds user by id.
  const { userId } = await params;
  const user = await UsersModel.findById(userId).lean();

  if (!user) throw generateErrorResponse(404, 'User was not found');
  if (!user.avatarUrl) throw generateErrorResponse(404, `Avatar doesn't exist`);

  //Deletes avatar file and updates user data.
  await unlink(path.join(AVATAR_DIRECTORY, user.avatarUrl));
  await UsersModel.findByIdAndUpdate(userId, { $unset: { avatarUrl: null } });

  return new NextResponse('Avatar was deleted successfully', {
    status: 200,
    statusText: 'Avatar was deleted successfully'
  });
};

export const POST = commonUserEndpoint(postAvatar);
export const DELETE = commonUserEndpoint(deleteAvatar);
