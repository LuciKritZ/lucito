export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

// Convert to milliseconds
const convertToMilliSeconds = (expiryTimeInMin: number): number =>
  expiryTimeInMin * 60 * 1000;

// Email

// Notifications

// OTP
export const generateOTP = () => {
  const otp = Math.floor(1_00_000 + Math.random() * 9_00_000);
  let expiry = new Date();

  expiry.setTime(new Date().getTime() + convertToMilliSeconds(5));

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, phoneNumber: string) => {
  const accountSid = TWILIO_ACCOUNT_SID;
  const authToken = TWILIO_AUTH_TOKEN;

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
