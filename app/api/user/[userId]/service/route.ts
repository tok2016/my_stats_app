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

const checkProfile: Record<
  ServiceName,
  (credentials: NewService) => Promise<ServiceStatus>
> = {
  spotify: () => new Promise((resolve) => resolve('unknown')),
  steam: async (credentials) => {
    const params = new URLSearchParams();
    params.set('key', process.env.STEAM_KEY ?? '');
    params.set('steamid', credentials.login);
    params.set('format', 'json');
    params.set('include_appinfo', 'true');
    params.set('include_played_free_games', 'true');

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

const postServiceCredentials: CommonUserEndpointAction<
  '/api/user/[userId]/service'
> = async (req, params) => {
  const { userId } = await params;
  const serviceCredentials = await validateData<NewService>(
    ServiceValidator,
    await req.json()
  );

  const updatedService = await ServiceCredentialsModel.findOneAndUpdate(
    { userId, name: serviceCredentials.name },
    {
      login: serviceCredentials.login,
      status: await checkProfile[serviceCredentials.name](serviceCredentials)
    }
  ).lean();

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
