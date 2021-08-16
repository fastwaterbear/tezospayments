import type { Donation, Payment } from '@tezospayments/common/dist/models/payment';
import type { Service } from '@tezospayments/common/dist/models/service';
import type { Network } from '@tezospayments/common/src/models/blockchain';

export interface PaymentInfo {
  readonly payment: Payment | Donation;
  readonly service: Service;
  readonly network: Network;
}
