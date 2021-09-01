import { CustomNetwork, Donation, Network, Payment, text } from '@tezospayments/common';

import type { PaymentUrlType } from '../models';

export abstract class PaymentUrlFactory {
  constructor(readonly urlType: PaymentUrlType) {
  }

  protected get urlTypePrefix() {
    return text.padStart(this.urlType.toString(), 2, '0');
  }

  abstract createPaymentUrl(paymentOrDonation: Payment | Donation, network: Network | CustomNetwork): string | Promise<string>;
}
