import { NextRequest, NextResponse } from 'next/server';
import { ZodOptional, ZodType } from 'zod';

import { NewDashboard } from '@ts/users/dashboard';
import { UserRouteParams } from '@ts/users/user';

import { getDashboards } from '@lib/auth';
import { DashboardValidator, validateData } from '@lib/validation-schemas';
import { DashboardsModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { commonUserEndpoint } from '@lib/endpoint-generators';

const getUserDashboards = async (params: UserRouteParams) => {
  const { userId } = await params;
  const dashboards = await getDashboards(userId);
  return NextResponse.json(dashboards, {
    status: 200,
    statusText: 'Dashboards were found'
  });
};

const postUserDashboard = async (params: UserRouteParams, req: NextRequest) => {
  const { userId } = await params;
  const dashboard = await validateData<NewDashboard>(
    DashboardValidator,
    await req.json()
  );
  await DashboardsModel.create({ ...dashboard, userId });

  const dashboards = await getDashboards(userId);
  return NextResponse.json(dashboards, {
    status: 201,
    statusText: 'Dashboard was created successfully'
  });
};

const putUserDashbord = async (params: UserRouteParams, req: NextRequest) => {
  const { userId } = await params;
  const dashboardId = req.nextUrl.searchParams.get('dashboardId');

  if (!dashboardId)
    throw generateErrorResponse(400, 'Dashboard id was not given');

  const dashboard = await validateData<
    NewDashboard,
    ZodOptional<ZodType<NewDashboard>>
  >(DashboardValidator.optional(), await req.json());

  await DashboardsModel.findByIdAndUpdate(dashboardId, dashboard);

  const dashboards = await getDashboards(userId);
  return NextResponse.json(dashboards, {
    status: 200,
    statusText: 'Dashboard was updated successfully'
  });
};

const deleteUserDashboard = async (
  params: UserRouteParams,
  req: NextRequest
) => {
  const { userId } = await params;
  const dashboardId = req.nextUrl.searchParams.get('dashboardId');

  if (!dashboardId) {
    await DashboardsModel.deleteMany({ userId });
    return new NextResponse('All user dashboards were deleted', {
      status: 200,
      statusText: 'All user dashboards were deleted successfully'
    });
  }

  await DashboardsModel.findByIdAndDelete(dashboardId);
  return new NextResponse('', {
    status: 200,
    statusText: 'Dashboard was deleted successfully'
  });
};

export const GET = commonUserEndpoint(getUserDashboards);
export const POST = commonUserEndpoint(postUserDashboard);
export const PUT = commonUserEndpoint(putUserDashbord);
export const DELETE = commonUserEndpoint(deleteUserDashboard);
