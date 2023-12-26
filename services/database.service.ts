import { connect } from 'mongoose';

import { MONGO_DB_URI } from '@/config';

export default async () => {
  console.info('<<<<< Connecting to database...');

  try {
    await connect(MONGO_DB_URI, {
      autoIndex: true,
    });
    console.info('...database connected! >>>>>');
  } catch (error) {
    console.error(`Oops! Error connecting to database: ${error} \n >>>>>`);
  }
};
