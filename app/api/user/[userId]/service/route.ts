import { NextRequest, NextResponse } from 'next/server';
import { Document } from 'mongoose';

import Service from '@ts/users/service';

import { checkUserAuthorRights, generateAccessError } from '@lib/auth';
import { ServiceCredentialsModel } from '@lib/models';
import { ServiceValidator } from '@lib/validationSchemas';

const transformServices = (
  services: (Document<unknown, {}, Service, {}, {}> & Service)[]
): Service[] =>
  services.map((service) => ({
    id: service.id,
    name: service.name,
    login: service.login,
    status: service.status,
    userId: service.userId
  }));

export const getServicesByUserId = async (
  userId: string
): Promise<Service[]> => {
  const services = await ServiceCredentialsModel.find({ userId });
  return transformServices(services);
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const bearer = req.headers.get('Authorization');

  try {
    if (!(await checkUserAuthorRights(userId, bearer))) {
      return new NextResponse('Forbidden', {
        status: 403,
        statusText: 'Forbidden'
      });
    }

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
    if (!(await checkUserAuthorRights(userId, bearer))) {
      return new NextResponse('Forbidden', {
        status: 403,
        statusText: 'Forbidden'
      });
    }

    const serviceCredentials = await ServiceValidator.safeParseAsync(
      await req.json()
    );

    if (!serviceCredentials.success) {
      return NextResponse.json(serviceCredentials.error.issues, {
        status: 400,
        statusText: 'Invalid data'
      });
    }

    switch (serviceCredentials.data.name) {
      case 'spotify':
        //decode token and extract email and status
        break;
      case 'steam':
        //find steam id by steam username and define status
        break;
    }

    await ServiceCredentialsModel.create({
      ...serviceCredentials.data,
      userId
    });

    const services = await getServicesByUserId(userId);

    return NextResponse.json(services, {
      status: 201,
      statusText: 'Service credentials were saved successfully'
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

  try {
    if (!(await checkUserAuthorRights(userId, bearer))) {
      return new NextResponse('Forbidden', {
        status: 403,
        statusText: 'Forbidden'
      });
    }

    const serviceCredentials = await ServiceValidator.safeParseAsync(
      await req.json()
    );

    if (!serviceCredentials.success) {
      return NextResponse.json(serviceCredentials.error.issues, {
        status: 400,
        statusText: 'Invalid data'
      });
    }

    switch (serviceCredentials.data.name) {
      case 'spotify':
        //decode token and extract email and status
        break;
      case 'steam':
        //find steam id by steam username and define status
        break;
    }

    await ServiceCredentialsModel.updateOne(
      { userId, name: serviceCredentials.data.name },
      {
        login: serviceCredentials.data.login,
        status: serviceCredentials.data.status
      }
    );

    const services = await getServicesByUserId(userId);

    return NextResponse.json(services, {
      status: 200,
      statusText: 'Service credentials were updated successfully'
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
    if (!(await checkUserAuthorRights(userId, bearer))) {
      return new NextResponse('Forbidden', {
        status: 403,
        statusText: 'Forbidden'
      });
    }

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
