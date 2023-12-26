import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateCustomerInput, CustomerAuthenticationPayload } from '@/dto';
import { validate } from 'class-validator';
import {
  generateOTP,
  generatePassword,
  generateSalt,
  generateSignature,
  onRequestOTP,
} from '@/utils';
import { Customer } from '@/models';

export const signUpCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInput, req.body);

  const inputErrors = await validate(customerInputs, {
    validationError: {
      target: true,
    },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = customerInputs;

  const salt = await generateSalt();
  const userPassword = await generatePassword(password, salt);

  const { otp, expiry: otpExpiry } = generateOTP();

  const customer = await Customer.create({
    email,
    password: userPassword,
    salt,
    otp,
    otpExpiry,
    firstName: '',
    lastName: '',
    address: '',
    verified: false,
    lat: 0,
    lng: 0,
    phone,
  });

  if (customer) {
    // 1. Send the OTP to customer
    await onRequestOTP(otp, phone);

    // 2. Generate the signature
    const signature = generateSignature<CustomerAuthenticationPayload>({
      _id: customer._id,
      email,
      verified: customer.verified,
    });

    // TODO: Continue from HERE
    // 3. Send the result to client
  }
};

export const logInCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const verifyCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const requestOtpForCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const updateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
