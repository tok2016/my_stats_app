import bcrypt from 'bcrypt';

import { GeneralEndpointAction } from '@ts/requests';
import { UserLogin } from '@ts/users/user';

import { generateAccessResponse } from '@lib/auth';
import { generalEndpoint } from '@lib/endpoint-generators';
import { CredentialsModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { UserLoginValidator, validateData } from '@lib/validation-schemas';

/**
 * Public method. Authenticates the user with given username or email.
 * @param req - Request object with login data.
 * @throws 400 is login data is invalid or passwords mismatch.
 * @throws 404 if user is not found.
 * @returns Refresh and access tokens.
 */
const login: GeneralEndpointAction<'/api/login'> = async (req) => {
  //Validates login data.
  const userLogin = await validateData<UserLogin>(
    UserLoginValidator,
    await req.json()
  );

  //Finds user's credentials data.
  const credentials = await CredentialsModel.findOne({
    $or: [{ username: userLogin.credential }, { email: userLogin.credential }]
  }).lean();

  if (!credentials) {
    throw generateErrorResponse(404, 'User was not found');
  }

  //Compares passwords.
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
