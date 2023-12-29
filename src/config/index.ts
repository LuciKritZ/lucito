import { NodeEnv } from '@/dto';

export const getEnvVariable = (key: keyof NodeEnv): string =>
  process.env[key] ?? '';
