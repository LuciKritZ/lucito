import {
  getCustomerProfile,
  logInCustomer,
  requestOtpForCustomer,
  signUpCustomer,
  updateCustomerProfile,
  verifyCustomer,
} from '@/controllers';
import { authenticate } from '@/middlewares';
import { Router } from 'express';

const router = Router();

// Signup/ create customer
router.post('/sign-up', signUpCustomer);

// Login
router.post('/login', logInCustomer);

// Protected routes
router.use(authenticate);

// Verify customer account
router.post('/verify', verifyCustomer);

// OTP/Requesting OTP
router.post('/otp', requestOtpForCustomer);

// Profile
router.get('/profile', getCustomerProfile);
router.patch('/profile', updateCustomerProfile);

export { router as customerRouter };
