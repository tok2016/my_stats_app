import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import {
  extractToken,
  generateAccessError,
  generateAccessResponse,
  getCredentialsById
} from '@lib/auth';
import { PasswordUpdateValidator } from '@lib/validationSchemas';
import { CredentialsModel } from '@lib/models';

export async function POST(req: NextRequest) {
  const bearer = req.headers.get('Authorization');

  try {
    const token = await extractToken(bearer);
    const credentials = await getCredentialsById(token.id);

    const passwordUpdate = await PasswordUpdateValidator.safeParseAsync(
      await req.json()
    );

    if (!passwordUpdate.success) {
      return NextResponse.json(passwordUpdate.error.issues, {
        status: 400,
        statusText: 'Invalid data'
      });
    }

    const arePasswordsSame = await bcrypt.compare(
      passwordUpdate.data.old,
      credentials.password
    );

    if (!arePasswordsSame) {
      return new NextResponse('Wrong old password', {
        status: 400,
        statusText: 'Wrong old password'
      });
    }

    if (!process.env.HASH_SALT) {
      return new NextResponse(null, {
        status: 500,
        statusText: 'Internal server error'
      });
    }

    const hashedPassword = await bcrypt.hash(
      passwordUpdate.data.new,
      parseInt(process.env.HASH_SALT)
    );

    await CredentialsModel.findByIdAndUpdate(
      token.id,
      { password: hashedPassword },
      { new: true }
    );

    return await generateAccessResponse(credentials.id, credentials.username);
  } catch (err) {
    return generateAccessError(err);
  }
}
