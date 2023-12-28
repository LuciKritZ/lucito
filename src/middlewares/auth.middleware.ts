import { validateSignature } from '@/utils';
import { Request, Response, NextFunction } from 'express';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValidated = await validateSignature(req);

  if (isValidated) {
    next();
  } else {
    return res.json({ message: 'Authentication verification failed.' });
  }
};
