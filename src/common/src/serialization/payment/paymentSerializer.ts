import BigNumber from 'bignumber.js';

import type { NonSerializedPaymentSlice, Payment, SerializedPayment } from '../../models';
import { PaymentType } from '../../models/payment/paymentBase';
import { URL } from '../../native';
import { Base64Deserializer, SerializedFieldType } from '../base64';

export class PaymentSerializer {
  protected static readonly serializedPaymentFieldTypes: ReadonlyMap<
    keyof SerializedPayment, SerializedFieldType | readonly SerializedFieldType[]
  > = new Map<keyof SerializedPayment, SerializedFieldType | readonly SerializedFieldType[]>()
    // amount
    .set('a', 'string')
    // data
    .set('d', 'object')
    // asset
    .set('as', ['string', 'undefined', 'null'])
    // successUrl
    .set('su', ['string', 'undefined', 'null'])
    // cancelUrl
    .set('cu', ['string', 'undefined', 'null'])
    // created
    .set('c', 'number')
    // expired
    .set('e', ['number', 'undefined', 'null']);
  protected static readonly serializedPaymentBase64Deserializer = new Base64Deserializer<SerializedPayment>(
    PaymentSerializer.serializedPaymentFieldTypes
  );

  deserialize(serializedPaymentBase64: string, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment | null {
    try {
      const serializedPayment = PaymentSerializer.serializedPaymentBase64Deserializer.deserialize(serializedPaymentBase64);

      return serializedPayment ? this.mapDeserializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) : null;
    }
    catch {
      return null;
    }
  }

  protected mapDeserializedPaymentToPayment(serializedPayment: SerializedPayment, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment {
    return {
      type: PaymentType.Payment,
      amount: new BigNumber(serializedPayment.a),
      data: serializedPayment.d,
      asset: serializedPayment.as,
      successUrl: serializedPayment.su ? new URL(serializedPayment.su) : undefined,
      cancelUrl: serializedPayment.cu ? new URL(serializedPayment.cu) : undefined,
      created: new Date(serializedPayment.c),
      expired: serializedPayment.e ? new Date(serializedPayment.e) : undefined,
      targetAddress: nonSerializedPaymentSlice.targetAddress
    };
  }
}
