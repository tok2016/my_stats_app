import { readFile } from 'fs/promises';
import path from 'path';

import { NextResponse } from 'next/server';

import { GeneralEndpointAction } from '@ts/requests';

import { AVATAR_DIRECTORY } from '@lib/auth';
import { generalEndpoint } from '@lib/endpoint-generators';
import { generateErrorResponse } from '@lib/utils';

/**
 * Public method. Returns image file of avatar by id.
 * @param _req - Request object.
 * @param params - Route params with avatar id.
 * @throws 400 if avatar is is not given.
 * @throws 404 if avatar file is not found.
 * @returns Avatar file.
 */
const getAvatarById: GeneralEndpointAction<'/api/avatar/[avatarId]'> = async (
  _req,
  params
) => {
  const { avatarId } = await params;
  if (!avatarId) throw generateErrorResponse(400, 'Avatar id was not given');

  try {
    //Finds file by path and defines it's MIME type. File's name is avatar id.
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
