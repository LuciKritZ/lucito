import { getEnvVariable } from '@/config';
import { convertToMilliSeconds, getRandomOTP } from './numbers.util';

// Email

// Notifications

// OTP
export const generateOTP = () => {
  const otp = getRandomOTP();
  let expiry = new Date();

  expiry.setTime(new Date().getTime() + convertToMilliSeconds(5));

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, phoneNumber: string) => {
  const accountSid = getEnvVariable('TWILIO_ACCOUNT_SID');
  const authToken = getEnvVariable('TWILIO_AUTH_TOKEN');

  try {
    const client = require('twilio')(accountSid, authToken);

    await client.messages.create({
      from: '+19735473166',
      to: phoneNumber,
      body: `Your OTP from Lucito is ${otp}.`,
    });
  } catch (error) {
    console.error(`Error in requesting OTP: ${error}`);
  }
};

// Payment notifications or emails
