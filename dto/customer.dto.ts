/**
 * @see https://github.com/typestack/class-validator/issues/684
 * In case of confusion of upper case and lower case properties imported from 'class-validator'.
 */

import { IsEmail, isEmpty, Length } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;
}

export interface CustomerAuthenticationPayload {
  _id: ObjectId;
  email: string;
  verified: boolean;
}
