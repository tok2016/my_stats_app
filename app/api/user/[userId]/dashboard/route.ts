import { NextResponse } from 'next/server';

import { CommonUserEndpointAction } from '@ts/requests';

import { commonUserEndpoint } from '@lib/endpoint-generators';
import { UsersModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { DashboardValidator, validateData } from '@lib/validation-schemas';

const getDashboard: CommonUserEndpointAction<
  '/api/user/[userId]/dashboard'
> = async (_req, params) => {
  const { userId } = await params;
  const user = await UsersModel.findById(userId).lean();

  if (!user) throw generateErrorResponse(404, 'User was not found');
  return NextResponse.json(user.metrics, {
    status: 200,
    statusText: 'Dashboard metrics were found'
  });
};

const postNewMetric: CommonUserEndpointAction<
  '/api/user/[userId]/dashboard'
> = async (req, params) => {
  const { userId } = await params;
  const metricId = await validateData(DashboardValidator, await req.text());

  const updatedUser = await UsersModel.findByIdAndUpdate(
    userId,
    { $addToSet: { metrics: metricId } },
    { new: true }
  ).lean();

  if (!updatedUser) throw generateErrorResponse(404, 'User was not found');
  return NextResponse.json(updatedUser.metrics, {
    status: 201,
    statusText: 'New metric was added to dashboard'
  });
};

const deleteMetric: CommonUserEndpointAction<
  '/api/user/[userId]/dashboard'
> = async (req, params) => {
  const { userId } = await params;
  const metricId = await validateData(DashboardValidator, await req.text());

  const updatedUser = await UsersModel.findByIdAndUpdate(
    userId,
    { $pull: { metrics: metricId } },
    { new: true }
  ).lean();

  if (!updatedUser) throw generateErrorResponse(404, 'User was not found');
  return NextResponse.json(updatedUser.metrics, {
    status: 201,
    statusText: 'Metric was removed from dashboard'
  });
};

const deleteDashboard: CommonUserEndpointAction<
  '/api/user/[userId]/dashboard'
> = async (_req, params) => {
  const { userId } = await params;
  const user = await UsersModel.findByIdAndUpdate(userId, {
    metrics: []
  });

  if (!user) throw generateErrorResponse(404, 'User was not found');
  return new NextResponse('All dashboard metrics were deleted');
};

export const GET = commonUserEndpoint(getDashboard);
export const POST = commonUserEndpoint(postNewMetric);
export const PUT = commonUserEndpoint(deleteMetric);
export const DELETE = commonUserEndpoint(deleteDashboard);
