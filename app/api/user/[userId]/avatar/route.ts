import { writeFile, unlink } from 'node:fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { v4 } from 'uuid';
import path from 'path';

import Avatar from '@ts/users/avatar';
import { UserRouteParams } from '@ts/users/user';

import { AVATAR_DIRECTORY } from '@lib/auth';
import { UsersModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { commonUserEndpoint } from '@lib/endpoint-generators';

const postAvatar = async (params: UserRouteParams, req: NextRequest) => {
  const { userId } = await params;
  const user = await UsersModel.findById(userId).lean();

  if (!user) throw generateErrorResponse(404, 'User was not found');

  const avatarRaw = (await req.formData()).get('avatar') as Blob | null;
  if (!avatarRaw || !avatarRaw.type.includes('image'))
    throw generateErrorResponse(400, 'Invalid file format');

  try {
    if (user.avatarUrl) {
      await unlink(path.join(AVATAR_DIRECTORY, user.avatarUrl));
    }
  } catch {}

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

const deleteAvatar = async (params: UserRouteParams) => {
  const { userId } = await params;
  const user = await UsersModel.findById(userId).lean();

  if (!user) throw generateErrorResponse(404, 'User was not found');
  if (!user.avatarUrl) throw generateErrorResponse(404, `Avatar doesn't exist`);

  await unlink(path.join(AVATAR_DIRECTORY, user.avatarUrl));
  await UsersModel.findByIdAndUpdate(userId, { $unset: { avatarUrl: null } });

  return new NextResponse('Avatar was deleted successfully', {
    status: 200,
    statusText: 'Avatar was deleted successfully'
  });
};

export const POST = commonUserEndpoint(postAvatar);
export const DELETE = commonUserEndpoint(deleteAvatar);
