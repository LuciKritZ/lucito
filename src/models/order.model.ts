import { OrderItem } from '@/dto';
import { Schema, Document, model } from 'mongoose';

export interface OrderDocument extends Document {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: Date;
  paymentMode: string;
  paymentResponse: string;
  orderStatus: string;
}

const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
    },
    items: [
      {
        foodItem: {
          type: Schema.Types.ObjectId,
          ref: 'FoodItem',
          required: true,
        },
        unit: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    paymentMode: {
      type: String,
    },
    paymentResponse: { type: String },
    orderStatus: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Order = model<OrderDocument>('Order', OrderSchema);

export { Order };
