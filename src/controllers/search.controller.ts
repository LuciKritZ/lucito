import { FoodItem, Vendor } from '@/models';
import { Request, Response, NextFunction } from 'express';

export const checkFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pinCode } = req.params;

  const availableFoodItems = await Vendor.find({
    pinCode: { $eq: pinCode },
    serviceAvailable: true,
  })
    .sort([['rating', 'descending']])
    .populate('foodItems');

  if (availableFoodItems.length > 0) {
    return res.status(200).json(availableFoodItems);
  }

  return res.status(400).json({ message: 'No data found.' });
};

export const findTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pinCode } = req.params;

  const availableRestaurants = await Vendor.find({
    pinCode: { $eq: pinCode },
    serviceAvailable: true,
  })
    .sort([['rating', 'descending']])
    .limit(1);

  if (availableRestaurants.length > 0) {
    return res.status(200).json(availableRestaurants);
  }

  return res.status(400).json({ message: 'No data found.' });
};

export const getFoodWithin30Minutes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pinCode } = req.params;

  const availableFoodItems = await FoodItem.aggregate([
    {
      $match: {
        preparationTime: {
          $lte: 30,
        },
      },
    },
    {
      $lookup: {
        from: 'vendors',
        localField: 'vendorId',
        foreignField: '_id',
        as: 'vendor',
      },
    },
    {
      $unwind: {
        path: '$vendor',
      },
    },
    {
      $match: {
        $and: [
          { 'vendor.pinCode': pinCode },
          {
            'vendor.serviceAvailable': {
              $eq: true,
            },
          },
        ],
      },
    },
    // TODO: Remove and add fields based on the requirement
    // {
    //   $set: {
    //     pinCode: pinCode,
    //   },
    // },
    // {
    //   $unset: 'vendor',
    // },
  ]);

  if (availableFoodItems.length > 0) {
    return res.status(200).json(availableFoodItems);
  }

  return res.status(400).json({ message: 'No data found.' });
};

export const searchFoodItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pinCode } = req.params;

  const availableFoodItems = await FoodItem.aggregate([
    {
      $lookup: {
        from: 'vendors',
        localField: 'vendorId',
        foreignField: '_id',
        as: 'vendor',
      },
    },
    {
      $unwind: {
        path: '$vendor',
      },
    },
    {
      $match: {
        $and: [
          { 'vendor.pinCode': pinCode },
          {
            'vendor.serviceAvailable': {
              $eq: true,
            },
          },
        ],
      },
    },
    {
      $set: {
        pinCode: pinCode,
      },
    },
    {
      $unset: 'vendor',
    },
  ]);

  if (availableFoodItems.length > 0) {
    return res.status(200).json(availableFoodItems);
  }

  return res.status(400).json({ message: 'No data found.' });
};

export const getRestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;

  const restaurant = await Vendor.findById(restaurantId).populate('foodItems');

  if (restaurant) {
    return res.status(200).json(restaurant);
  }

  return res.status(400).json({ message: 'No data found.' });
};
