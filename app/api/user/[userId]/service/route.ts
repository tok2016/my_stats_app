import { NextRequest, NextResponse } from 'next/server';

import {
  NewService,
  ServiceName,
  ServicesMap,
  ServiceStatus
} from '@ts/users/service';
import { SteamGamesList } from '@ts/games/game';

import { checkUserAuthorRights, generateAccessError } from '@lib/auth';
import { ServiceCredentialsModel } from '@lib/models';
import { ServiceValidator, validateData } from '@lib/validationSchemas';
import { AxiosSteamInstanse } from '@lib/axios-instanse';
import { SteamApiResponse } from '@ts/games/api-response';

const isSteamGameObject = (value: unknown): value is SteamGamesList =>
  (value as SteamGamesList).games !== undefined;

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
      console.log(response.data);

      return isSteamGameObject(response.data.response)
        ? 'authorized'
        : 'unauthorized';
    } catch {
      return 'error';
    }
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const bearer = req.headers.get('Authorization');

  try {
    await checkUserAuthorRights(userId, bearer);
    const services = await getServicesByUserId(userId);

    return NextResponse.json(services, {
      status: 200,
      statusText: 'Services credentials were found'
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
  } catch (err) {
    return generateAccessError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const serviceName = req.nextUrl.searchParams.get('service');
  const bearer = req.headers.get('Authorization');

  try {
    await checkUserAuthorRights(userId, bearer);

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
  } catch (err) {
    return generateAccessError(err);
  }
}
