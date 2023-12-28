import { AuthPayload } from '@/dto';

/**
 * @see https://stackoverflow.com/a/65446314
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
