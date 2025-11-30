import { NextRequest, NextResponse } from 'next/server';

import { NewService, ServicesMap } from '@ts/users/service';

import { checkUserAuthorRights, generateAccessError } from '@lib/auth';
import { ServiceCredentialsModel } from '@lib/models';
import { ServiceValidator, validateData } from '@lib/validationSchemas';

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

    switch (serviceCredentials.name) {
      case 'spotify':
        //decode token and extract email and status
        break;
      case 'steam':
        //find steam id by steam username and define status
        break;
    }

    await ServiceCredentialsModel.create({
      ...serviceCredentials,
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
    await checkUserAuthorRights(userId, bearer);
    const serviceCredentials = await validateData<NewService>(
      ServiceValidator,
      await req.json()
    );

    switch (serviceCredentials.name) {
      case 'spotify':
        //decode token and extract email and status
        break;
      case 'steam':
        //find steam id by steam username and define status
        break;
    }

    await ServiceCredentialsModel.updateOne(
      { userId, name: serviceCredentials.name },
      {
        login: serviceCredentials.login,
        status: serviceCredentials.status
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
