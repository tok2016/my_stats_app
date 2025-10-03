import { NextRequest, NextResponse } from 'next/server';

import {
  checkUserAuthorRights,
  generateAccessError,
  getDashboards
} from '@lib/auth';
import { DashboardValidator } from '@lib/validationSchemas';
import { DashboardsModel } from '@lib/models';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  if (!userId) {
    return new NextResponse('User id was not given', {
      status: 400,
      statusText: 'User id was not given'
    });
  }

  const bearer = req.headers.get('Authorization');

  try {
    if (!(await checkUserAuthorRights(userId, bearer))) {
      return new NextResponse('Unauthorized', {
        status: 403,
        statusText: 'Unauthorized'
      });
    }

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
  if (!userId) {
    return new NextResponse('User id was not given', {
      status: 400,
      statusText: 'User id was not given'
    });
  }

  const bearer = req.headers.get('Authorization');

  try {
    if (!(await checkUserAuthorRights(userId, bearer))) {
      return new NextResponse('Unauthorized', {
        status: 403,
        statusText: 'Unauthorized'
      });
    }

    const dashboard = await DashboardValidator.safeParseAsync(await req.json());
    if (!dashboard.success) {
      return NextResponse.json(dashboard.error.issues, {
        status: 400,
        statusText: 'Invalid data'
      });
    }

    await DashboardsModel.create({ ...dashboard.data, userId });

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
  if (!userId) {
    return new NextResponse('User id was not given', {
      status: 400,
      statusText: 'User id was not given'
    });
  }

  const bearer = req.headers.get('Authorization');
  const dashboardId = req.nextUrl.searchParams.get('dashboardId');

  if (!dashboardId) {
    return new NextResponse('Dashboard id was not given', {
      status: 400,
      statusText: 'Dashboard id was not given'
    });
  }

  try {
    if (!(await checkUserAuthorRights(userId, bearer))) {
      return new NextResponse('Unauthorized', {
        status: 403,
        statusText: 'Unauthorized'
      });
    }

    const dashboard = await DashboardValidator.optional().safeParseAsync(
      await req.json()
    );

    if (!dashboard.success) {
      return NextResponse.json(dashboard.error.issues, {
        status: 400,
        statusText: 'Invalid data'
      });
    }

    await DashboardsModel.findByIdAndUpdate(dashboardId, dashboard.data);

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
  if (!userId) {
    return new NextResponse('User id was not given', {
      status: 400,
      statusText: 'User id was not given'
    });
  }

  const bearer = req.headers.get('Authorization');
  const dashboardId = req.nextUrl.searchParams.get('dashboardId');

  try {
    if (!(await checkUserAuthorRights(userId, bearer))) {
      return new NextResponse('Unauthorized', {
        status: 403,
        statusText: 'Unauthorized'
      });
    }

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
