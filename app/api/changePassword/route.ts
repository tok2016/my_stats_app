import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import {
  extractToken,
  generateAccessError,
  generateAccessResponse,
  getCredentialsById,
  hashPassword
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

    const hashedPassword = await hashPassword(passwordUpdate.data.new);
    await CredentialsModel.findByIdAndUpdate(
      token.id,
      { password: hashedPassword },
      { new: true }
    );

    return await generateAccessResponse(
      credentials.id,
      credentials.username,
      'Password was changed successfully'
    );
  } catch (err) {
    return generateAccessError(err);
  }
}
