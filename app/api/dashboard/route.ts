import { NextResponse } from 'next/server';

import { ProtectedEndpointAction } from '@ts/requests';

import { getCredentialsById } from '@lib/auth';
import { protectedEndpoint } from '@lib/endpoint-generators';
import { UsersModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { DashboardValidator, validateData } from '@lib/validation-schemas';

const getDashboard: ProtectedEndpointAction<'/api/dashboard'> = async (
  _req,
  _params,
  token
) => {
  const credentials = await getCredentialsById(token.id);
  if (!credentials)
    throw generateErrorResponse(404, 'Credentials were not found');

  const user = await UsersModel.findById(credentials.userId).lean();
  if (!user) throw generateErrorResponse(404, 'User was not found');
  return NextResponse.json(user.metrics, {
    status: 200,
    statusText: 'Dashboard metrics were found'
  });
};

const postNewMetric: ProtectedEndpointAction<'/api/dashboard'> = async (
  req,
  _params,
  token
) => {
  const metricId = await validateData(DashboardValidator, await req.text());

  const credentials = await getCredentialsById(token.id);
  if (!credentials)
    throw generateErrorResponse(404, 'Credentials were not found');

  const updatedUser = await UsersModel.findByIdAndUpdate(
    credentials.userId,
    { $addToSet: { metrics: metricId } },
    { new: true }
  ).lean();

  if (!updatedUser) throw generateErrorResponse(404, 'User was not found');
  return NextResponse.json(updatedUser.metrics, {
    status: 201,
    statusText: 'New metric was added to dashboard'
  });
};

const deleteMetric: ProtectedEndpointAction<'/api/dashboard'> = async (
  req,
  _params,
  token
) => {
  const metricId = await validateData(DashboardValidator, await req.text());

  const credentials = await getCredentialsById(token.id);
  if (!credentials)
    throw generateErrorResponse(404, 'Credentials were not found');

  const updatedUser = await UsersModel.findByIdAndUpdate(
    credentials.userId,
    { $pull: { metrics: metricId } },
    { new: true }
  ).lean();

  if (!updatedUser) throw generateErrorResponse(404, 'User was not found');
  return NextResponse.json(updatedUser.metrics, {
    status: 201,
    statusText: 'Metric was removed from dashboard'
  });
};

const deleteDashboard: ProtectedEndpointAction<'/api/dashboard'> = async (
  _req,
  _params,
  token
) => {
  const credentials = await getCredentialsById(token.id);
  if (!credentials)
    throw generateErrorResponse(404, 'Credentials were not found');

  const user = await UsersModel.findByIdAndUpdate(credentials.userId, {
    metrics: []
  });

  if (!user) throw generateErrorResponse(404, 'User was not found');
  return new NextResponse('All dashboard metrics were deleted');
};

export const GET = protectedEndpoint(getDashboard);
export const POST = protectedEndpoint(postNewMetric);
export const PUT = protectedEndpoint(deleteMetric);
export const DELETE = protectedEndpoint(deleteDashboard);
