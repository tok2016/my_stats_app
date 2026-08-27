import bcrypt from 'bcrypt';

import { GeneralEndpointAction } from '@ts/requests';
import { UserLogin } from '@ts/users/user';

import { generateAccessResponse } from '@lib/auth';
import { generalEndpoint } from '@lib/endpoint-generators';
import { CredentialsModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { UserLoginValidator, validateData } from '@lib/validation-schemas';

const login: GeneralEndpointAction<'/api/login'> = async (req) => {
  const userLogin = await validateData<UserLogin>(
    UserLoginValidator,
    await req.json()
  );

  const credentials = await CredentialsModel.findOne({
    $or: [{ username: userLogin.credential }, { email: userLogin.credential }]
  }).lean();

  if (!credentials) {
    throw generateErrorResponse(401, 'User was not found');
  }

  const arePasswordsSame = await bcrypt.compare(
    userLogin.password,
    credentials.password
  );

  if (!arePasswordsSame) {
    throw generateErrorResponse(400, 'Wrong password');
  }

  return await generateAccessResponse(
    credentials._id.toString(),
    credentials.username
  );
};

export const POST = generalEndpoint(login);
