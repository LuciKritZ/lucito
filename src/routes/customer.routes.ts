import {
  addItemsToCart,
  createOrder,
  emptyCart,
  getAllOrders,
  getCartFromItems,
  getCustomerProfile,
  getOrderById,
  logInCustomer,
  requestOtpForCustomer,
  signUpCustomer,
  updateCustomerProfile,
  verifyCustomer,
} from '@/controllers';
import { authenticate } from '@/middlewares';
import { Router } from 'express';

const router = Router();

// Public
router.post('/sign-up', signUpCustomer);
router.post('/login', logInCustomer);

// Protected routes start from here
router.use(authenticate);

// Verify customer account
router.post('/verify', verifyCustomer);

// Requesting OTP
router.post('/otp', requestOtpForCustomer);

// Profile
router.get('/profile', getCustomerProfile);
router.patch('/profile', updateCustomerProfile);

// Cart
router.post('/cart', addItemsToCart);
router.get('/cart', getCartFromItems);
router.delete('/cart', emptyCart);

// Payment

// Order handing
router.post('/create-order', createOrder);
router.get('/orders', getAllOrders);
router.get('/order/:id', getOrderById);

export { router as customerRouter };
