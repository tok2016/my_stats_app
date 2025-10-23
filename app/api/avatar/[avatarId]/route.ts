import { readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { AVATAR_DIRECTORY, responseWithError } from '@lib/utils';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ avatarId: string }> }
) {
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
    return responseWithError(404, 'Avatar was not found');
  }
}
