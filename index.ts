import express from 'express';
import { applicationService, databaseService } from '@/services';

const PORT = 8080;

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
