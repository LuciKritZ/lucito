import { AuthPayload, NodeEnv } from '@/dto';

/**
 * @see https://stackoverflow.com/a/65446314
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv extends NodeEnv {}
  }
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
