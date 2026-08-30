import { readFile } from 'fs/promises';
import path from 'path';

import { NextResponse } from 'next/server';

import { GeneralEndpointAction } from '@ts/requests';

import { AVATAR_DIRECTORY } from '@lib/auth';
import { generalEndpoint } from '@lib/endpoint-generators';
import { generateErrorResponse } from '@lib/utils';

const getAvatarById: GeneralEndpointAction<'/api/avatar/[avatarId]'> = async (
  _req,
  params
) => {
  const { avatarId } = await params;
  if (!avatarId) throw generateErrorResponse(400, 'Avatar id was not given');

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

export const GET = generalEndpoint(getAvatarById);
