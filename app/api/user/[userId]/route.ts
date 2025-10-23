import { NextRequest, NextResponse } from 'next/server';

import { CredentialsModel, UsersModel } from '@lib/models';
import { responseWithError, uniteUserData } from '@lib/utils';
import { getDashboards } from '@lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  const credentials = await CredentialsModel.findOne({ userId }).lean();
  const userInfo = await UsersModel.findById(userId).lean();

  if (!credentials || !userInfo) {
    return responseWithError(404, 'User was not found');
  }

  if (!userInfo.isPublic) {
    return responseWithError(403, 'Forbidden');
  }

  const dashboards = await getDashboards(userId);

  return NextResponse.json(uniteUserData(credentials, userInfo, dashboards), {
    status: 200,
    statusText: `User ${credentials.username} was found`
  });
}
