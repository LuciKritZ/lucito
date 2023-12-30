import { FoodItemDocument } from '@/models';
import { ObjectId } from 'mongoose';

export interface OrderItem {
  foodItem:
    | (FoodItemDocument & {
        _id: ObjectId;
      })
    | ObjectId;
  unit: number;
}
