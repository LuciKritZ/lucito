import { ObjectId } from 'mongoose';

export interface OrderItem {
  foodItem: ObjectId;
  unit: number;
}
