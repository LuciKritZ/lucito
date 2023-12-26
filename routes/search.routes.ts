import {
  checkFoodAvailability,
  findTopRestaurants,
  getFoodWithin30Minutes,
  getRestaurantById,
  searchFoodItems,
} from '@/controllers';
import { Router } from 'express';

const router = Router();

// Food Availability
router.get('/:pinCode', checkFoodAvailability);

// Top Restaurants
router.get('/top-restaurants/:pinCode', findTopRestaurants);

// Food items available in 30 minutes
router.get('/available-within-30-minutes/:pinCode', getFoodWithin30Minutes);

// Search food items
router.get('/all/:pinCode', searchFoodItems);

// Find restaurant by ID
router.get('/food-items/:restaurantId', getRestaurantById);

export { router as searchRouter };
