import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import {
  AuthPayload,
  CreateCustomerInput,
  CustomerOrderInput,
  LoginCustomerInput,
  OrderItem,
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
import { Customer, FoodItem, Order } from '@/models';
import { UserIdentifierType } from './types.controller';
import { getRandomObjectId } from '@/utils/numbers.util';

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
    orders: [],
    cart: [],
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

export const addItemsToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await findCustomer({ _id: customer._id });

    if (profile) {
      const { _id, unit } = <CustomerOrderInput>req.body;
      let cartItems = Array() as [OrderItem];

      const foodItem = await FoodItem.findById(_id);

      if (foodItem) {
        cartItems = profile.cart;

        let isFoodItemInCart = cartItems.findIndex(
          (item) => String(item.foodItem) === String(_id)
        );

        if (unit > 0) {
          if (isFoodItemInCart === -1) {
            cartItems.push({ foodItem: _id, unit });
          } else {
            cartItems[isFoodItemInCart].unit = unit;
          }
        } else {
          if (isFoodItemInCart !== -1) {
            cartItems.splice(isFoodItemInCart, 1);
          }
        }

        if (cartItems) {
          await profile.populate('cart.foodItem');
          profile.cart = cartItems;
          const cartResult = await profile.save();

          return res.status(200).json(cartResult.cart);
        }
      }
      return res.status(404).json({ message: 'Food item not found.' });
    }

    return res.status(404).json({ message: 'User not found!' });
  }
  return res.status(400).json({ message: 'Unauthenticated' });
};

export const getCartFromItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await findCustomer({ _id: customer._id }).then((user) =>
      user?.populate('cart.foodItem')
    );

    if (profile) {
      return res.status(200).json(profile.cart);
    }

    return res.status(404).json({ message: 'User not found!' });
  }
  return res.status(400).json({ message: 'Unauthenticated' });
};

export const emptyCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await findCustomer({ _id: customer._id }).then((user) =>
      user?.populate('cart.foodItem')
    );

    if (profile) {
      profile.cart = [] as unknown as [OrderItem];
      const deletedCart = await profile.save();
      return res.status(200).json(deletedCart);
    }

    return res.status(404).json({ message: 'User not found!' });
  }
  return res.status(400).json({ message: 'Unauthenticated' });
};

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Grab current login customer
  const customer = req.user;

  if (customer) {
    // Create an order ID
    const orderId = getRandomObjectId();

    const profile = await findCustomer({ _id: customer._id });

    if (profile) {
      // Grab order items from request [{ id: XX, unit: XX }]
      const cart = <[CustomerOrderInput]>req.body;

      let cartItems = Array();

      let totalAmount = 0.0;

      // Calculate order amount
      const foodItems = await FoodItem.find()
        .where('_id')
        .in(cart.map((item) => item._id))
        .exec();

      foodItems.forEach((foodItem) => {
        cart.forEach(({ _id, unit }) => {
          if (foodItem._id === _id) {
            totalAmount += foodItem.price * unit;
            cartItems.push({ foodItem, unit });
          }
        });
      });

      // Create order with item descriptions
      if (cartItems) {
        const orderPlaced = await Order.create({
          orderId,
          items: cartItems,
          totalAmount,
          orderDate: new Date(),
          paymentMode: 'COD',
          paymentResponse: '',
          orderStatus: 'Waiting',
        });

        // Finally update orders to user account
        if (orderPlaced) {
          profile.orders.push(orderPlaced);
          await profile.save();

          return res.status(200).json(orderPlaced);
        }
        return res
          .status(400)
          .json({ message: 'Unable to place an order at the moment' });
      }
      return res
        .status(400)
        .json({ message: 'Unexpected error while placing an order' });
    }
    return res.status(403).json({ message: 'Unauthorized' });
  }
  return res.status(403).json({ message: 'Unauthorized' });
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await findCustomer({ _id: customer._id });

    if (profile) {
      const orders = await Order.find().where('_id').in(profile.orders).exec();
      return res.status(200).json(orders);
    }
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(403).json({ message: 'Unauthorized' });
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const orderId = req.params.id;

    if (orderId) {
      const order = await Order.findById(orderId).populate('items.foodItem');
      return res.status(200).json(order);
    }

    return res.status(404).json({ message: 'Please enter orderId' });
  }
  return res.status(403).json({ message: 'Unauthorized' });
};
