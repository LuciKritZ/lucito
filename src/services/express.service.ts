import {
  json as bodyParserJson,
  urlencoded as bodyParserUrlEncoded,
} from 'body-parser';
import { type Application, static as static_ } from 'express';
import { join as joinPath } from 'path';

import {
  adminRouter,
  customerRouter,
  searchRouter,
  vendorRouter,
} from '@/routes';

export default async (app: Application) => {
  app.use(bodyParserJson());
  app.use(bodyParserUrlEncoded({ extended: true }));

  // For storing images on the disk
  app.use('/images', static_(joinPath(__dirname, 'images')));

  // Routes
  app.use('/admin', adminRouter);
  app.use('/vendor', vendorRouter);
  app.use('/customer', customerRouter);
  app.use('/search', searchRouter);

  return app;
};
