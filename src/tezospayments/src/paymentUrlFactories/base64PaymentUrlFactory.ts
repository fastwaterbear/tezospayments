import {
  native, text,
  PaymentSerializer, CustomNetwork, Network, Payment, Donation, DonationSerializer, PaymentType
} from '@tezospayments/common';

import constants from '../constants';
import { DonationUrlError, PaymentUrlError } from '../errors';
import { PaymentUrlType } from '../models';
import { PaymentUrlFactory } from './paymentUrlFactory';

export class Base64PaymentUrlFactory extends PaymentUrlFactory {
  static readonly baseUrl = constants.paymentAppBaseUrl;

  protected readonly paymentSerializer: PaymentSerializer = new PaymentSerializer();
  protected readonly donationSerializer: DonationSerializer = new DonationSerializer();

  constructor(readonly baseUrl: string = Base64PaymentUrlFactory.baseUrl) {
    super(PaymentUrlType.Base64);
  }

  private get urlTypePrefix() {
    return text.padStart(this.urlType.toString(), 2, '0');
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
      return this.createUrl(true, payment.targetAddress, serializedPaymentBase64, network);
    } catch (error: unknown) {
      throw new PaymentUrlError('It\'s impossible to create an URL for the payment');
    }
  }

  protected createDonationUrlInternal(donation: Donation, network: Network | CustomNetwork): string {
    const serializedDonationBase64 = this.donationSerializer.serialize(donation);
    if (!serializedDonationBase64 && serializedDonationBase64 !== '')
      throw new DonationUrlError('It\'s impossible to serialize the donation');

    try {
      return this.createUrl(false, donation.targetAddress, serializedDonationBase64, network);
    } catch (error: unknown) {
      throw new DonationUrlError('It\'s impossible to create an URL for the donation');
    }
  }

  protected createUrl(
    isPayment: boolean,
    targetAddress: string,
    serializedPaymentOrDonationBase64: string,
    network: Network | CustomNetwork
  ) {
    const url = new native.URL(`${targetAddress}/${isPayment ? 'payment' : 'donation'}`, this.baseUrl);

    if (serializedPaymentOrDonationBase64 !== '')
      url.hash = this.urlTypePrefix + serializedPaymentOrDonationBase64;
    if (network.name !== constants.defaultNetworkName)
      url.searchParams.append('network', network.name);

    return url.href;
  }
}
