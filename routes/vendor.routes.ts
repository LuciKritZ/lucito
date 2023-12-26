import { Router, Request, Response, NextFunction } from 'express';

import {
  addFoodItem,
  getFoodItems,
  getVendorProfile,
  loginVendor,
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

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Hello from vendor router' });
});

export { router as vendorRouter };
