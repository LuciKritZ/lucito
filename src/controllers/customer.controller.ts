import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import {
  AuthPayload,
  CreateCustomerInput,
  LoginCustomerInput,
  UpdateCustomerProfileInput,
} from '@/dto';
import { validate } from 'class-validator';
import {
  generateOTP,
  generatePassword,
  generateSalt,
  generateSignature,
  onRequestOTP,
  validatePassword,
} from '@/utils';
import { Customer } from '@/models';
import { UserIdentifierType } from './types.controller';

export const findCustomer = async ({
  _id,
  email = '',
  phone = '',
}: UserIdentifierType) => {
  const existingCustomer = await Customer.findOne({
    $or: [
      { _id: { $eq: _id } },
      { email: { $eq: email } },
      { phone: { $eq: phone } },
    ],
  });

  return existingCustomer;
};

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

  const isExistingCustomer = await findCustomer({ email, phone });

  if (isExistingCustomer) {
    return res.status(409).json({ message: 'Email or phone already in use.' });
  }

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
    const signature = generateSignature<AuthPayload>({
      _id: customer._id,
      email,
      verified: customer.verified,
      phone,
    });

    // 3. Send the result to client
    return res.status(201).json({
      signature,
      verified: customer.verified,
      email: customer.email,
    });
  }
};

export const logInCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(LoginCustomerInput, req.body);

  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (loginErrors.length) {
    return res.status(400).json(loginErrors);
  }

  const { email, password: enteredPassword } = loginInputs;

  const customer = await findCustomer({ email });

  if (customer) {
    const { password: savedPassword, salt, _id, verified, phone } = customer;
    const validation = await validatePassword({
      enteredPassword,
      savedPassword,
      salt,
    });

    if (validation) {
      const signature = generateSignature<AuthPayload>({
        _id,
        email,
        verified,
        phone,
      });

      return res.status(201).json({
        signature,
        verified,
        email,
      });
    }

    return res.status(401).json({
      message: 'Incorrect password',
    });
  }

  return res.status(400).json({
    message: 'Email not found!',
  });
};

export const verifyCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;

  const customer = req.user;

  if (!!customer?.verified) {
    return res.status(200).json({
      message: 'User already verified',
    });
  }

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otpExpiry >= new Date()) {
        profile.verified = true;

        const verifiedCustomer = await profile.save();
        const { _id, email, verified, phone } = verifiedCustomer;

        const signature = generateSignature<AuthPayload>({
          _id,
          email,
          verified,
          phone,
        });

        return res.status(201).json({
          signature,
          verified,
          email,
        });
      }

      return res.status(409).json({
        message: 'Invalid OTP',
      });
    }
  }

  return res.status(400).json({
    message: 'Can not verify OTP',
  });
};

export const requestOtpForCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const customer = await findCustomer({ _id: user._id });

    if (customer) {
      const { otp, expiry } = generateOTP();

      customer.otp = otp;
      customer.otpExpiry = expiry;

      await customer.save();

      await onRequestOTP(otp, customer.phone);

      return res
        .status(200)
        .json({ message: 'OTP sent to your registered phone number!' });
    }
  }

  return res.status(400).json({ message: 'Can not request OTP' });
};

export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await findCustomer({ _id: customer._id });

    if (profile) {
      return res.status(200).json(profile);
    }
    return res.status(400).json({ message: 'Customer not found' });
  }

  return res.status(400).json({ message: 'Please try again.' });
};

export const updateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profileInputs = plainToClass(UpdateCustomerProfileInput, req.body);

    const profileInputErrors = await validate(profileInputs, {
      validationError: { target: false },
    });

    if (profileInputErrors.length > 0) {
      return res.status(400).json(profileInputErrors);
    }

    const profile = await findCustomer({ _id: customer._id });

    if (profile) {
      const { firstName, lastName, address } = profileInputs;

      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      await profile.save();
      return res.status(200).json(profile);
    }

    return res.status(400).json({ message: 'Customer not found' });
  }

  return res.status(400).json({ message: 'Please try again.' });
};
