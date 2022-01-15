import {
  native, PaymentUrlType,
  PaymentSerializer, CustomNetwork, Network, Payment, Donation, DonationSerializer, PaymentType, getEncodedPaymentUrlType
} from '@tezospayments/common';

import constants from '../constants';
import { DonationUrlError, PaymentUrlError } from '../errors';
import { PaymentUrlFactory } from './paymentUrlFactory';

export class Base64PaymentUrlFactory extends PaymentUrlFactory {
  static readonly baseUrl = constants.paymentAppBaseUrl;

  protected readonly paymentSerializer: PaymentSerializer = new PaymentSerializer();
  protected readonly donationSerializer: DonationSerializer = new DonationSerializer();

  constructor(readonly baseUrl: string = Base64PaymentUrlFactory.baseUrl) {
    super(PaymentUrlType.Base64);
  }

  createPaymentUrl(paymentOrDonation: Payment | Donation, network: Network | CustomNetwork): string {
    return paymentOrDonation.type === PaymentType.Payment
      ? this.createPaymentUrlInternal(paymentOrDonation, network)
      : this.createDonationUrlInternal(paymentOrDonation, network);
  }

  protected createPaymentUrlInternal(payment: Payment, network: Network | CustomNetwork): string {
    const serializedPaymentBase64 = this.paymentSerializer.serialize(payment);
    if (!serializedPaymentBase64)
      throw new PaymentUrlError('It\'s impossible to serialize the payment');

    try {
      const url = new native.URL(this.baseUrl);

      return this.createUrl(url, serializedPaymentBase64, network);
    } catch (error: unknown) {
      throw new PaymentUrlError('It\'s impossible to create an URL for the payment');
    }
  }

  protected createDonationUrlInternal(donation: Donation, network: Network | CustomNetwork): string {
    const serializedDonationBase64 = this.donationSerializer.serialize(donation);
    if (!serializedDonationBase64 && serializedDonationBase64 !== '')
      throw new DonationUrlError('It\'s impossible to serialize the donation');

    try {
      const url = new native.URL(`${donation.targetAddress}/donation`, this.baseUrl);

      return this.createUrl(url, serializedDonationBase64, network);
    } catch (error: unknown) {
      throw new DonationUrlError('It\'s impossible to create an URL for the donation');
    }
  }

  protected createUrl(baseUrl: native.URL, serializedPaymentOrDonationBase64: string, network: Network | CustomNetwork) {
    if (serializedPaymentOrDonationBase64 !== '')
      baseUrl.hash = getEncodedPaymentUrlType(this.urlType) + serializedPaymentOrDonationBase64;
    if (network.name !== constants.defaultNetworkName)
      baseUrl.searchParams.append('network', network.name);

    return baseUrl.href;
  }
}
