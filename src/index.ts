import express from 'express';
import { applicationService, databaseService } from '@/services';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const PORT: number = Number(process.env.PORT) || 8080;

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
