import { readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { generateErrorResponse } from '@lib/utils';
import { AVATAR_DIRECTORY } from '@lib/auth';
import { generalEndpoint } from '@lib/endpoint-generators';

type AvatarRouteParams = { avatarId: string };

const getAvatarById = async (_req: NextRequest, params?: AvatarRouteParams) => {
  if (!params) throw generateErrorResponse(400, 'Avatar id was not given');
  const { avatarId } = await params;

  try {
    const avatarBuffer = await readFile(path.join(AVATAR_DIRECTORY, avatarId));

    const mimeType = `image/${avatarId.split('.').at(-1) ?? 'png'}`;
    const avatarFile = new File([new Uint8Array(avatarBuffer)], avatarId, {
      type: mimeType
    });

    return new NextResponse(avatarFile, {
      status: 200,
      statusText: 'Avatar was found',
      headers: {
        'Content-Type': mimeType
      }
    });
  } catch {
    throw generateErrorResponse(404, 'Avatar was not found');
  }
};

export const GET = generalEndpoint<AvatarRouteParams>(getAvatarById);
