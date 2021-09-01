import type { CustomNetwork, Donation, Network, Payment } from '@tezospayments/common';

import type { PaymentUrlType } from '../models';

export abstract class PaymentUrlFactory {
  constructor(readonly urlType: PaymentUrlType) {
  }

  abstract createPaymentUrl(paymentOrDonation: Payment | Donation, network: Network | CustomNetwork): string | Promise<string>;
}
