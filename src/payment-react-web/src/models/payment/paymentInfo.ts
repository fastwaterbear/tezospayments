import type { Payment } from '@tezospayments/common/dist/models/payment';
import type { Service } from '@tezospayments/common/dist/models/service';

export interface PaymentInfo {
  readonly payment: Payment;
  readonly service: Service;
}
