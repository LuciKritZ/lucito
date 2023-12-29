// Generate random object id
export const getRandomObjectId = () => {
  return `${Math.floor(Math.random() * 89999) + 1000}`;
};

// Convert to milliseconds
export const convertToMilliSeconds = (expiryTimeInMin: number): number =>
  expiryTimeInMin * 60 * 1000;

// Generate OTP
export const getRandomOTP = (): number => {
  return Number(Math.floor(1_00_000 + Math.random() * 9_00_000));
};
