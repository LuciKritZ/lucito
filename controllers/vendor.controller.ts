import type { Request, Response, NextFunction } from 'express';

import { findVendor } from './admin.controller';
import type {
  AuthPayload,
  CreateFoodItemInput,
  EditVendorInput,
  VendorLoginInput,
} from '@/dto';
import { generateSignature, validatePassword } from '@/utils';
import { UserIdentifierType } from './types.controller';
import { FoodItem } from '@/models';

export const loginVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password: enteredPassword } = req.body as VendorLoginInput;

  const existingVendor = await findVendor({ email });

  if (existingVendor) {
    const { salt, password: savedPassword } = existingVendor;
    const isPasswordCorrect = await validatePassword({
      enteredPassword,
      savedPassword,
      salt,
    });

    if (isPasswordCorrect) {
      const { email, _id, phone }: UserIdentifierType = existingVendor;
      const signature = generateSignature({ email, _id, phone });
      return res.json({ token: signature });
    } else {
      return res.json({ message: 'Invalid password entered.' });
    }
  }

  return res.json({ message: 'Vendor not found.' });
};

export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = <AuthPayload>req.user;

  if (vendor) {
    const existingVendor = await findVendor({ _id: vendor._id });
    return res.json(existingVendor);
  }

  return res.json({ message: 'Vendor information not found.' });
};

export const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = <AuthPayload>req.user;

  if (vendor) {
    const existingVendor = await findVendor({ _id: vendor._id });

    if (existingVendor) {
      const { address, foodType, name, phone } = <EditVendorInput>req.body;

      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.foodType = foodType;
      existingVendor.phone = phone;

      const savedResult = await existingVendor.save();
      return res.json(savedResult);
    }
  }

  return res.json({ message: 'Vendor information not found.' });
};

export const updateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = <AuthPayload>req.user;

  if (vendor) {
    const existingVendor = await findVendor({ _id: vendor._id });

    if (existingVendor) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

      const savedResult = await existingVendor.save();
      return res.json(savedResult);
    }
  }

  return res.json({ message: 'Vendor information not found.' });
};

export const addFoodItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = <AuthPayload>req.user;

  if (vendor) {
    const {
      name,
      category,
      description,
      foodType,
      preparationTime,
      price,
    }: CreateFoodItemInput = req.body;

    const existingVendor = await findVendor({ _id: vendor._id });

    if (existingVendor) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      const foodItem = await FoodItem.create({
        vendorId: vendor._id,
        name,
        description,
        category,
        foodType,
        preparationTime,
        price,
        rating: 0,
        images,
      });

      existingVendor.foodItems.push(foodItem);
      existingVendor.save();

      return res.json(foodItem);
    }
  }

  return res.json({ message: 'Vendor information not found.' });
};

export const getFoodItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = <AuthPayload>req.user;

  if (vendor) {
    const vendorFoodItems = await FoodItem.find({
      vendorId: { $eq: vendor._id },
    });

    if (vendorFoodItems) {
      return res.json(vendorFoodItems);
    }
  }

  return res.json({ message: 'No food items available.' });
};

export const updateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = <AuthPayload>req.user;

  if (vendor) {
    const existingVendor = await findVendor({ _id: vendor._id });

    if (existingVendor) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);

      existingVendor.coverImages.push(...images);

      existingVendor.save();

      return res.json(existingVendor);
    }
  }

  return res.json({ message: 'Vendor information not found.' });
};
