import BigNumber from 'bignumber.js';

import type { NonSerializedPaymentSlice, Payment, LegacySerializedPayment } from '../../models';
import { PaymentType } from '../../models/payment/paymentBase';
import { URL } from '../../native';
import { Base64Deserializer, SerializedFieldType } from '../base64';

export class LegacyPaymentSerializer {
  protected static readonly serializedPaymentFieldTypes: ReadonlyMap<
    keyof LegacySerializedPayment, SerializedFieldType | readonly SerializedFieldType[]
  > = new Map<keyof LegacySerializedPayment, SerializedFieldType | readonly SerializedFieldType[]>()
    .set('amount', 'string')
    .set('data', 'object')
    .set('asset', ['string', 'undefined', 'null'])
    .set('successUrl', ['string', 'undefined', 'null'])
    .set('cancelUrl', ['string', 'undefined', 'null'])
    .set('created', 'number')
    .set('expired', ['number', 'undefined', 'null']);
  protected static readonly serializedPaymentBase64Deserializer = new Base64Deserializer<LegacySerializedPayment>(
    LegacyPaymentSerializer.serializedPaymentFieldTypes
  );

  deserialize(serializedPaymentBase64: string, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment | null {
    try {
      const serializedPayment = LegacyPaymentSerializer.serializedPaymentBase64Deserializer.deserialize(serializedPaymentBase64);

      return serializedPayment ? this.mapDeserializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) : null;
    }
    catch {
      return null;
    }
  }

  protected mapDeserializedPaymentToPayment(serializedPayment: LegacySerializedPayment, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment {
    return {
      type: PaymentType.Payment,
      amount: new BigNumber(serializedPayment.amount),
      data: serializedPayment.data,
      asset: serializedPayment.asset,
      successUrl: serializedPayment.successUrl ? new URL(serializedPayment.successUrl) : undefined,
      cancelUrl: serializedPayment.cancelUrl ? new URL(serializedPayment.cancelUrl) : undefined,
      created: new Date(serializedPayment.created),
      expired: serializedPayment.expired ? new Date(serializedPayment.expired) : undefined,
      targetAddress: nonSerializedPaymentSlice.targetAddress,
      urls: nonSerializedPaymentSlice.urls
    };
  }
}
