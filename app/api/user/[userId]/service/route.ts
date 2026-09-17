import { NextResponse } from 'next/server';

import { SteamApiResponse } from '@ts/games/api-response';
import { SteamGamesList } from '@ts/games/game';
import { CommonUserEndpointAction } from '@ts/requests';
import {
  NewService,
  ServiceName,
  ServiceStatus,
  ServicesMap
} from '@ts/users/service';

import { AxiosSteamInstanse } from '@lib/axios-instanse';
import { commonUserEndpoint } from '@lib/endpoint-generators';
import { ServiceCredentialsModel } from '@lib/models';
import { isSteamGameObject } from '@lib/type-guards';
import { ServiceValidator, validateData } from '@lib/validation-schemas';

/**
 * Finds service credentials of user of given id.
 * @param userId - User id with service credentials to find.
 * @returns Service credentials by service.
 */
const getServicesByUserId = async (userId: string): Promise<ServicesMap> => {
  const services = await ServiceCredentialsModel.find({ userId }).lean();

  const entries = services.map((service) => [
    service.name,
    {
      ...service,
      id: service._id.toString()
    }
  ]);

  return Object.fromEntries(entries);
};

/**
 * Checks if user is authorized in the service.
 */
const checkProfileStatus: Record<
  ServiceName,
  (credentials: NewService) => Promise<ServiceStatus>
> = {
  spotify: () => Promise.resolve('unknown'),
  steam: async (credentials) => {
    //Checks steam account existance and publicity by given steam ID.
    const params = new URLSearchParams();
    params.set('key', process.env.STEAM_KEY ?? '');
    params.set('steamid', credentials.login);
    params.set('format', 'json');

    try {
      const response = await AxiosSteamInstanse.get<
        SteamApiResponse<SteamGamesList | object>
      >(`/IPlayerService/GetOwnedGames/v0001/?${params.toString()}`);

      return isSteamGameObject(response.data.response)
        ? 'authorized'
        : 'unauthorized';
    } catch {
      return 'error';
    }
  }
};

/**
 * Protected method. Finds service credentials by user id.
 * @param _req - Request object.
 * @param params - Route params with user id.
 * @throws 403 if user id contradicts the user who sent the request.
 * @throws 404 is user is not found.
 * @returns Service credentials by service.
 */
const getServiceCredentials: CommonUserEndpointAction<
  '/api/user/[userId]/service'
> = async (_req, params) => {
  const { userId } = await params;
  const services = await getServicesByUserId(userId);

  return NextResponse.json(services, {
    status: 200,
    statusText: 'Services credentials were found'
  });
};

/**
 * Protected method. Adds or updates credentials of services by user id.
 * @param req - Request object with service credentials data.
 * @param params - Route params with user id.
 * @throws 403 if user id contradicts the user who sent the request.
 * @throws 404 is user is not found.
 * @returns Updated service credentials by service.
 */
const postServiceCredentials: CommonUserEndpointAction<
  '/api/user/[userId]/service'
> = async (req, params) => {
  //Validates new credentials data.
  const { userId } = await params;
  const serviceCredentials = await validateData<NewService>(
    ServiceValidator,
    await req.json()
  );

  //Updates service credentials and checks authorization status
  const updatedService = await ServiceCredentialsModel.findOneAndUpdate(
    { userId, name: serviceCredentials.name },
    {
      login: serviceCredentials.login,
      status:
        await checkProfileStatus[serviceCredentials.name](serviceCredentials)
    }
  ).lean();

  //Stores credentials if none of them was found.
  if (!updatedService) {
    await ServiceCredentialsModel.create({
      ...serviceCredentials,
      userId
    });
  }

  const services = await getServicesByUserId(userId);

  return NextResponse.json(services, {
    status: 201,
    statusText: 'Service credentials were saved successfully'
  });
};

/**
 * Protected method. Deletes service credentials by user id and service. Deletes all credentials of user if service is not given.
 * @param req - Request object with service which credentials are intended to remove.
 * @param params - Route params with user id.
 * @throws 403 if user id contradicts the user who sent the request.
 * @throws 404 is user is not found.
 * @returns Response object.
 */
const deleteServiceCredentials: CommonUserEndpointAction<
  '/api/user/[userId]/service'
> = async (req, params) => {
  const { userId } = await params;
  const serviceName = req.nextUrl.searchParams.get('service');

  if (!serviceName) {
    await ServiceCredentialsModel.deleteMany({ userId });

    return new NextResponse(
      'All services credentials were deleted successfully',
      {
        status: 200,
        statusText: 'All services credentials were deleted successfully'
      }
    );
  }

  await ServiceCredentialsModel.deleteOne({ userId, name: serviceName });

  return new NextResponse(
    `Your ${serviceName} credentials were deleted successfully`,
    {
      status: 200,
      statusText: `Your ${serviceName} credentials were deleted successfully`
    }
  );
};

export const GET = commonUserEndpoint(getServiceCredentials);
export const POST = commonUserEndpoint(postServiceCredentials);
export const DELETE = commonUserEndpoint(deleteServiceCredentials);
