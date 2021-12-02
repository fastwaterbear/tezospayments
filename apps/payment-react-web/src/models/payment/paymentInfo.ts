import type { Donation, Payment, Service } from '@tezospayments/common';

export interface PaymentInfo {
  readonly payment: Payment | Donation;
  readonly service: Service;
}
