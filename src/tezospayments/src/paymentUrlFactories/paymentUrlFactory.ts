import { CustomNetwork, Donation, Network, Payment, PaymentUrlType } from '@tezospayments/common';

export abstract class PaymentUrlFactory {
  constructor(readonly urlType: PaymentUrlType) {
  }

  abstract createPaymentUrl(paymentOrDonation: Payment | Donation, network: Network | CustomNetwork): string | Promise<string>;
}
