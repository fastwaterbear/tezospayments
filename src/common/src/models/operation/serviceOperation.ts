import { DonationOperation } from './donationOperation';
import { PaymentOperation } from './paymentOperation';

export type ServiceOperation =
  | PaymentOperation
  | DonationOperation;
