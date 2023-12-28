import { type Application, static as static_, json, urlencoded } from 'express';
import { join as joinPath } from 'path';

import {
  adminRouter,
  customerRouter,
  searchRouter,
  vendorRouter,
} from '@/routes';

export default async (app: Application) => {
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // For storing images on the disk
  app.use('/images', static_(joinPath(__dirname, 'images')));

  // Routes
  app.use('/admin', adminRouter);
  app.use('/vendor', vendorRouter);
  app.use('/customer', customerRouter);
  app.use('/search', searchRouter);

  return app;
};
