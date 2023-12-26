// Email

// Notifications

// OTP
export const generateOTP = () => {
  const otp = Math.floor(1_00_000 + Math.random() * 9_00_000);
  let expiry = new Date();

  const convertToMilliSeconds = (expiryTimeInMin: number): number =>
    expiryTimeInMin * 60 * 1000;

  expiry.setTime(new Date().getTime() + convertToMilliSeconds(5));

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, phoneNumber: string) => {
  const accountSid = '';
  const authToken = '';
  const client = require('twilio')(accountSid, authToken);

  const response = await client.message.create({
    body: `Your OTP is ${otp}`,
    from: '',
    to: phoneNumber,
  });
};

// Payment notifications or emails
