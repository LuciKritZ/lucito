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
import { FoodItem, Order } from '@/models';

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
      const signature = generateSignature<UserIdentifierType>({
        email,
        _id,
        phone,
      });
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

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate(
      'items.foodItem'
    );

    if (orders) {
      return res.status(200).json(orders);
    }

    return res.status(404).json({ message: 'No orders found.' });
  }
  return res.status(403).json({ message: 'Not authorized' });
};

export const processOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;
  const { status, remarks, time } = req.body;

  if (orderId) {
    const order = await Order.findById(orderId).populate('items');

    if (order) {
      order.orderStatus = status;
      order.remarks = remarks;

      if (time) {
        order.preparationTime = time;
      }

      const updatedOrder = await order.save();

      if (updatedOrder) {
        return res.status(200).json(updatedOrder);
      }

      return res.json(500).json({ message: 'Unable to update order.' });
    }
    return res.status(404).json({ message: 'Order ID does not exist.' });
  }

  return res.status(404).json({ message: 'Invalid Order ID' });
};

export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;

  if (orderId) {
    const order = await Order.findById(orderId).populate('items.foodItem');

    if (order) {
      return res.status(200).json(order);
    }

    return res.status(404).json({ message: 'No orders found.' });
  }
  return res.status(403).json({ message: 'Invalid Order Id' });
};
