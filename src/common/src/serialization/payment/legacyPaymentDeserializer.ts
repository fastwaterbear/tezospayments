import BigNumber from 'bignumber.js';

import type { NonSerializedPaymentSlice, Payment, LegacySerializedPayment } from '../../models';
import { PaymentType } from '../../models/payment/paymentBase';
import { URL } from '../../native';
import { Base64Deserializer } from '../base64';
import { legacySerializedPaymentFieldTypes } from './serializedPaymentFieldTypes';

export class LegacyPaymentDeserializer {
  protected static readonly serializedPaymentBase64Deserializer = new Base64Deserializer<LegacySerializedPayment>(
    legacySerializedPaymentFieldTypes
  );

  deserialize(serializedPaymentBase64: string, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment | null {
    try {
      const serializedPayment = LegacyPaymentDeserializer.serializedPaymentBase64Deserializer.deserialize(serializedPaymentBase64);

      return serializedPayment ? this.mapSerializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) : null;
    }
    catch {
      return null;
    }
  }

  protected mapSerializedPaymentToPayment(serializedPayment: LegacySerializedPayment, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment {
    return {
      type: PaymentType.Payment,
      id: 'legacy-payment',
      amount: new BigNumber(serializedPayment.amount),
      data: serializedPayment.data,
      asset: serializedPayment.asset,
      successUrl: serializedPayment.successUrl ? new URL(serializedPayment.successUrl) : undefined,
      cancelUrl: serializedPayment.cancelUrl ? new URL(serializedPayment.cancelUrl) : undefined,
      created: new Date(serializedPayment.created),
      expired: serializedPayment.expired ? new Date(serializedPayment.expired) : undefined,
      targetAddress: nonSerializedPaymentSlice.targetAddress
    };
  }
}
