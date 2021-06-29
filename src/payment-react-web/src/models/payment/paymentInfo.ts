import type { Payment } from '@tezos-payments/common/dist/models/payment';
import type { Service } from '@tezos-payments/common/dist/models/service';

export interface PaymentInfo {
  readonly payment: Payment;
  readonly service: Service;
}
