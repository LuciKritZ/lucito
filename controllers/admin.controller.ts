import { Request, Response, NextFunction } from 'express';

import { UserIdentifierType } from './types.controller';
import { CreateVendorInput } from '@/dto';
import { Vendor } from '@/models';
import { generatePassword, generateSalt } from '@/utils';

export const findVendor = async ({
  _id,
  email = '',
  phone = '',
}: UserIdentifierType) => {
  const existingVendor = await Vendor.findOne({
    $or: [
      { _id: { $eq: _id } },
      { email: { $eq: email } },
      { phone: { $eq: phone } },
    ],
  });

  return existingVendor;
};

export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pinCode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } = <CreateVendorInput>req.body;

  const existingVendor = await findVendor({ email, phone });

  if (existingVendor) {
    return res.json({
      message: 'A vendor already exists with this email or phone number.',
    });
  }

  /**
   * 1. Generate a salt
   * 2. Encrypt the password using salt
   */
  const salt = await generateSalt();
  const hashedPassword = await generatePassword(password, salt);

  const vendor = await Vendor.create({
    name,
    address,
    pinCode,
    foodType,
    email,
    password: hashedPassword,
    salt,
    ownerName,
    phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foodItems: [],
  });

  return res.json(vendor);
};

export const getVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find();

  if (vendors) {
    return res.json(vendors);
  }

  return res.json({ message: 'Vendors data is not available.' });
};

export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const vendor = await findVendor({
    _id: id as unknown as UserIdentifierType['_id'],
  });

  if (vendor) {
    return res.json(vendor);
  }

  return res.json({ message: 'Vendor not found.' });
};
