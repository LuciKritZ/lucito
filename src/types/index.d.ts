import { AuthPayload } from '@/dto';

/**
 * @see https://stackoverflow.com/a/65446314
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_DB_URI: string;
      JWT_AUTH_SECRET: string;
      TWILIO_ACCOUNT_SID: string;
      TWILIO_AUTH_TOKEN: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
    }
  }
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
