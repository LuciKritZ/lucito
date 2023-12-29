export interface NodeEnv {
  MONGO_DB_URI: string;
  JWT_AUTH_SECRET: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  NODE_ENV: 'development' | 'production';
  PORT?: string;
  PWD: string;
}
