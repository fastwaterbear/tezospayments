import BigNumber from 'bignumber.js';

import type { NonSerializedPaymentSlice, Payment, SerializedPayment } from '../../models';
import { PaymentType } from '../../models/payment/paymentBase';
import { URL } from '../../native';
import { Base64Deserializer } from '../base64';
import { serializedPaymentFieldTypes } from './serializedPaymentFieldTypes';

export class PaymentDeserializer {
  protected static readonly serializedPaymentBase64Deserializer = new Base64Deserializer<SerializedPayment>(
    serializedPaymentFieldTypes
  );

  deserialize(serializedPaymentBase64: string, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment | null {
    try {
      const serializedPayment = PaymentDeserializer.serializedPaymentBase64Deserializer.deserialize(serializedPaymentBase64);

      return serializedPayment ? this.mapSerializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) : null;
    }
    catch {
      return null;
    }
  }

  protected mapSerializedPaymentToPayment(serializedPayment: SerializedPayment, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment {
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
