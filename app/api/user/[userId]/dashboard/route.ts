import { NextRequest, NextResponse } from 'next/server';
import { ZodOptional, ZodType } from 'zod';

import { NewDashboard } from '@ts/users/dashboard';

import {
  checkUserAuthorRights,
  generateAccessError,
  getDashboards
} from '@lib/auth';
import { DashboardValidator, validateData } from '@lib/validationSchemas';
import { DashboardsModel } from '@lib/models';
import { responseWithError } from '@lib/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const bearer = req.headers.get('Authorization');

  try {
    await checkUserAuthorRights(userId, bearer);

    const dashboards = await getDashboards(userId);
    return NextResponse.json(dashboards, {
      status: 200,
      statusText: 'Dashboards were found'
    });
  } catch (err) {
    return generateAccessError(err);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const bearer = req.headers.get('Authorization');

  try {
    await checkUserAuthorRights(userId, bearer);

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
  } catch (err) {
    return generateAccessError(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const bearer = req.headers.get('Authorization');
  const dashboardId = req.nextUrl.searchParams.get('dashboardId');

  if (!dashboardId) {
    return responseWithError(400, 'Dashboard id was not given');
  }

  try {
    await checkUserAuthorRights(userId, bearer);

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
  const dashboardId = req.nextUrl.searchParams.get('dashboardId');

  try {
    await checkUserAuthorRights(userId, bearer);

    if (!dashboardId) {
      await DashboardsModel.deleteMany({ userId });
      return new NextResponse('All user dashboards were deleted', {
        status: 200,
        statusText: 'All user dashboards were deleted successfully'
      });
    }

    await DashboardsModel.deleteMany({ userId });
    return new NextResponse('', {
      status: 200,
      statusText: 'Dashboard was deleted successfully'
    });
  } catch (err) {
    return generateAccessError(err);
  }
}
