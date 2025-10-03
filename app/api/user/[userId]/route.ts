import { NextRequest, NextResponse } from 'next/server';

import { CredentialsModel, UsersModel } from '@lib/models';
import { uniteUserData } from '@lib/utils';
import { getDashboards } from '@lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  const credentials = await CredentialsModel.findOne({ userId }).lean();
  const userInfo = await UsersModel.findById(userId).lean();

  if (!credentials || !userInfo) {
    return new NextResponse('User was not found', {
      status: 404,
      statusText: 'User was not found'
    });
  }

  if (!userInfo.isPublic) {
    return new NextResponse('Forbidden', {
      status: 403,
      statusText: 'Forbidden'
    });
  }

  const dashboards = await getDashboards(userId);

  return NextResponse.json(uniteUserData(credentials, userInfo, dashboards), {
    status: 200,
    statusText: `User ${credentials.username} was found`
  });
}
