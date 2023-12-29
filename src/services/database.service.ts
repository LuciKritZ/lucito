import { getEnvVariable } from '@/config';
import { connect } from 'mongoose';

export default async () => {
  console.info('<<<<< Connecting to database...');

  try {
    await connect(getEnvVariable('MONGO_DB_URI'), {
      autoIndex: true,
    });
    console.info('...database connected! >>>>>');
  } catch (error) {
    console.error(`Oops! Error connecting to database: ${error} \n >>>>>`);
  }
};
