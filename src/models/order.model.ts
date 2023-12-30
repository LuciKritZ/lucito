import { OrderItem } from '@/dto';
import { Schema, Document, model } from 'mongoose';

export interface OrderDocument extends Document {
  orderId: string;
  vendorId: Schema.Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  orderDate: Date;
  paymentMode: string;
  paymentResponse: string;
  orderStatus: string;
  remarks: string;
  deliveryId: string;
  appliedOffers: boolean;
  offerId: string;
  preparationTime: number; // It can be maximum 60 minutes [Worst case scenario]
}

const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
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
    remarks: {
      type: String,
    },
    deliveryId: { type: String },
    appliedOffers: { type: Boolean },
    offerId: { type: String },
    preparationTime: { type: Number },
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
