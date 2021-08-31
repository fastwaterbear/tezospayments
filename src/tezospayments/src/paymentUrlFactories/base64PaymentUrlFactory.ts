import { PaymentSerializer, CustomNetwork, Network, Payment, native, text } from '@tezospayments/common';

import constants from '../constants';
import { PaymentUrlError } from '../errors';
import { PaymentUrlType } from '../models';
import { PaymentUrlFactory } from './paymentUrlFactory';

export class Base64PaymentUrlFactory extends PaymentUrlFactory {
  static readonly baseUrl = constants.paymentAppBaseUrl;

  protected readonly paymentSerializer: PaymentSerializer = new PaymentSerializer();

  constructor(readonly baseUrl = Base64PaymentUrlFactory.baseUrl) {
    super(PaymentUrlType.Base64);
  }

  private get urlTypePrefix() {
    return text.padStart(this.urlType.toString(), 2, '0');
  }

  createPaymentUrl(payment: Payment, network: Network | CustomNetwork): string | Promise<string> {
    const serializedPaymentBase64 = this.paymentSerializer.serialize(payment);
    if (!serializedPaymentBase64)
      throw new PaymentUrlError('It\'s impossible to serialize the payment');

    try {
      const url = new native.URL('payment', this.baseUrl);
      url.hash = this.urlTypePrefix + serializedPaymentBase64;
      if (network.name !== constants.defaultNetworkName)
        url.searchParams.append('network', network.name);

      return url.href;
    } catch (error: unknown) {
      throw new PaymentUrlError('It\'s impossible to create an URL for the payment');
    }
  }
}
