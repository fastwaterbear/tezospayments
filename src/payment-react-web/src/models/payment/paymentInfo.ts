import type { Donation, Payment } from '@tezospayments/common/dist/models/payment';
import type { Service } from '@tezospayments/common/dist/models/service';

export interface PaymentInfo {
  readonly payment: Payment | Donation;
  readonly service: Service;
}
