import { ObjectId } from 'mongoose';

export type AuthPayload = {
  _id: ObjectId;
  email: string;
  phone: string;
};
