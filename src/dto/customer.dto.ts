/**
 * @see https://github.com/typestack/class-validator/issues/684
 * In case of confusion of upper case and lower case properties imported from 'class-validator'.
 */

import { IsEmail, isEmpty, Length } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(7, 13)
  phone: string;

  @Length(6, 12)
  password: string;
}

export class LoginCustomerInput {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class UpdateCustomerProfileInput {
  @Length(3, 16)
  firstName: string;

  @Length(3, 16)
  lastName: string;

  @Length(6, 16)
  address: string;
}

export interface CustomerAuthenticationPayload {
  _id: ObjectId;
  email: string;
  verified: boolean;
}

export interface CustomerOrderInput {
  _id: string;
  unit: number;
}
