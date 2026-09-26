import { NextResponse } from 'next/server';

import { CommonUserEndpointAction } from '@ts/requests';

import { commonUserEndpoint } from '@lib/endpoint-generators';
import { UsersModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { DashboardValidator, validateData } from '@lib/validation-schemas';

/**
 * Protected method. Finds dashboard by user id.
 * @param _req - Request object.
 * @param params - Route params with user id.
 * @throws 403 if user id contradicts the user who sent the request.
 * @throws 404 if user is not found.
 * @returns Array of stored metrics ids.
 */
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

/**
 * Protected method. Adds new metric to dashboard by user id.
 * @param req - Request object with metric id to add.
 * @param params - Route params with user id.
 * @throws 400 if metric id is invalid.
 * @throws 403 if user id contradicts the user who sent the request.
 * @throws 404 if user if not found.
 * @returns Updated array of metrics ids.
 */
const postNewMetric: CommonUserEndpointAction<
  '/api/user/[userId]/dashboard'
> = async (req, params) => {
  //Validates new metric id.
  const { userId } = await params;
  const metricId = await validateData(DashboardValidator, await req.text());

  //Adds new metric id.
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

/**
 * Protected method. Removes metric from dashboard by user id.
 * @param req - Request object with metric id to remove.
 * @param params - Route params with user id.
 * @throws 400 if metric id is invalid.
 * @throws 403 if user id contradicts the user who sent the request.
 * @throws 404 if user if not found.
 * @returns Updated array of metrics ids.
 */
const deleteMetric: CommonUserEndpointAction<
  '/api/user/[userId]/dashboard'
> = async (req, params) => {
  //Validates new metric id.
  const { userId } = await params;
  const metricId = await validateData(DashboardValidator, await req.text());

  //Removes new metric id.
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

/**
 * Protected method. Deletes all metrics from dashboard by user id.
 * @param _req - Request object.
 * @param params - Route params with user id.
 * @throws 403 if user id contradicts the user who sent the request.
 * @throws 404 if user if not found.
 * @returns Response object.
 */
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
