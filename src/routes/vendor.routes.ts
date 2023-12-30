import { Router } from 'express';

import {
  addFoodItem,
  getFoodItems,
  getOrderDetails,
  getOrders,
  getVendorProfile,
  loginVendor,
  processOrder,
  updateVendorCoverImage,
  updateVendorProfile,
  updateVendorService,
} from '@/controllers';
import { authenticate } from '@/middlewares';
import { imagesMulter } from '@/utils';

const router = Router();

// Public APIs
router.post('/login', loginVendor);

// Authentication
router.use(authenticate);

// Profile
router.get('/profile', getVendorProfile);
router.patch('/profile', updateVendorProfile);
router.patch('/cover-images', imagesMulter, updateVendorCoverImage);
router.patch('/serviceable', updateVendorService);

// Food Items
router.post('/food-item', imagesMulter, addFoodItem);
router.get('/food-items', getFoodItems);

// Orders
router.get('/orders', getOrders);
router.put('/order/:orderId/process', processOrder);
router.get('/order/:orderId', getOrderDetails);

export { router as vendorRouter };
