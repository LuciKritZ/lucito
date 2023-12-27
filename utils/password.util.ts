import { genSalt, hash } from 'bcrypt';

import { ValidatePasswordType } from './types.util';
import type { AuthPayload } from '@/dto';
import { sign, verify } from 'jsonwebtoken';
import { JWT_AUTH_SECRET } from '@/config';
import { Request } from 'express';

export const generateSalt = async () => await genSalt();

export const generatePassword = async (password: string, salt: string) =>
  await hash(password, salt);

export const validatePassword = async ({
  enteredPassword,
  salt,
  savedPassword,
}: ValidatePasswordType) =>
  (await generatePassword(enteredPassword, salt)) === savedPassword;

export function generateSignature<T>(userIdentifier: T) {
  return sign(userIdentifier as T & object, JWT_AUTH_SECRET, {
    expiresIn: '1d',
  });
}

export const validateSignature = async (req: Request) => {
  const signature = req.get('Authorization');

  if (signature) {
    const payload = verify(
      signature.split(' ')[1],
      JWT_AUTH_SECRET
    ) as AuthPayload;

    req.user = payload;

    return true;
  }

  return false;
};
