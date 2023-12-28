import { connect } from 'mongoose';

export default async () => {
  console.info('<<<<< Connecting to database...');

  try {
    await connect(process.env.MONGO_DB_URI, {
      autoIndex: true,
    });
    console.info('...database connected! >>>>>');
  } catch (error) {
    console.error(`Oops! Error connecting to database: ${error} \n >>>>>`);
  }
};
