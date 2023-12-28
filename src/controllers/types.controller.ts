import { type ObjectId } from 'mongoose';

export interface UserIdentifierType {
  _id?: ObjectId;
  email?: string;
  phone?: string;
}
