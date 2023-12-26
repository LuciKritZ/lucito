import {
  json as bodyParserJson,
  urlencoded as bodyParserUrlEncoded,
} from 'body-parser';
import { type Application, static as static_ } from 'express';
import { join } from 'path';

import { adminRouter, searchRouter, vendorRouter } from '@/routes';

export default async (app: Application) => {
  app.use(bodyParserJson());
  app.use(bodyParserUrlEncoded({ extended: true }));

  // For storing images on the disk
  app.use('/images', static_(join(__dirname, 'images')));

  // Routes
  app.use('/admin', adminRouter);
  app.use('/vendor', vendorRouter);
  app.use('/search', searchRouter);

  return app;
};
