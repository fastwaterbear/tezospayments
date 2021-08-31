import type { CustomNetwork, Network, Payment } from '@tezospayments/common';

import type { PaymentUrlType } from '../models';

export abstract class PaymentUrlFactory {
  constructor(readonly urlType: PaymentUrlType) {
  }

  abstract createPaymentUrl(payment: Payment, network: Network | CustomNetwork): string | Promise<string>;
}
