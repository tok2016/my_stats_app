import { writeFile, unlink } from 'node:fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { v4 } from 'uuid';
import path from 'path';

import Avatar from '@ts/users/avatar';

import {
  AVATAR_DIRECTORY,
  checkUserAuthorRights,
  generateAccessError,
  getUserById
} from '@lib/auth';
import { UsersModel } from '@lib/models';
import { responseWithError } from '@lib/utils';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const bearer = req.headers.get('Authorization');

  try {
    await checkUserAuthorRights(userId, bearer);
    const user = await UsersModel.findById(userId).lean();

    if (!user) {
      return responseWithError(404, 'User was not found');
    }

    const avatarRaw = (await req.formData()).get('avatar') as Blob | null;
    if (!avatarRaw || !avatarRaw.type.includes('image')) {
      return responseWithError(400, 'Invalid file format');
    }

    if (user.avatarUrl) {
      await unlink(path.join(AVATAR_DIRECTORY, user.avatarUrl));
    }

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
  } catch (err) {
    return generateAccessError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const bearer = req.headers.get('Authorization');

  try {
    await checkUserAuthorRights(userId, bearer);
    const user = await getUserById(userId);

    if (!user.avatarUrl) {
      return new NextResponse(`Avatar doesn't exist`, {
        status: 404,
        statusText: `Avatar doesn't exist`
      });
    }

    await unlink(path.join(AVATAR_DIRECTORY, user.avatarUrl));

    return new NextResponse('Avatar was deleted successfully', {
      status: 200,
      statusText: 'Avatar was deleted successfully'
    });
  } catch (err) {
    return generateAccessError(err);
  }
}
