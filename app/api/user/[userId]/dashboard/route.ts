import { ZodOptional, ZodType } from 'zod';

import { NextResponse } from 'next/server';

import { CommonUserEndpointAction } from '@ts/requests';
import { NewDashboard } from '@ts/users/dashboard';

import { getDashboards } from '@lib/auth';
import { commonUserEndpoint } from '@lib/endpoint-generators';
import { DashboardsModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { DashboardValidator, validateData } from '@lib/validation-schemas';

const getUserDashboards: CommonUserEndpointAction<
  '/api/user/[userId]/dashboard'
> = async (_req, params) => {
  const { userId } = await params;
  const dashboards = await getDashboards(userId);
  return NextResponse.json(dashboards, {
    status: 200,
    statusText: 'Dashboards were found'
  });
};

const postUserDashboard: CommonUserEndpointAction<
  '/api/user/[userId]/dashboard'
> = async (req, params) => {
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

const putUserDashbord: CommonUserEndpointAction<
  '/api/user/[userId]/dashboard'
> = async (req, params) => {
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

const deleteUserDashboard: CommonUserEndpointAction<
  '/api/user/[userId]/dashboard'
> = async (req, params) => {
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
