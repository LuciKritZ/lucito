import express from 'express';
import { applicationService, databaseService } from '@/services';
import { config as dotenvConfig } from 'dotenv';
import { getEnvVariable } from './config';

dotenvConfig();

const PORT: number = Number(getEnvVariable('PORT')) || 3000;

const startServer = async () => {
  const app = express();

  // Database service
  await databaseService();

  // Express application service
  await applicationService(app);

  app.listen(PORT, () => {
    console.info(`<<<<< Listening to port: ${PORT} 🚀 >>>>>`);
  });
};

startServer();
