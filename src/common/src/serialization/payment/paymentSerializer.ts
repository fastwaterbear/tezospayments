import type { Payment, SerializedPayment } from '../../models';
import { Base64Serializer } from '../base64';
import { serializedPaymentFieldTypes } from './serializedPaymentFieldTypes';

export class PaymentSerializer {
  protected static readonly serializedPaymentBase64Serializer = new Base64Serializer<SerializedPayment>(
    serializedPaymentFieldTypes
  );

  serialize(payment: Payment): string | null {
    try {
      const serializedPayment = this.mapPaymentToSerializedPayment(payment);
      return PaymentSerializer.serializedPaymentBase64Serializer.serialize(serializedPayment);
    }
    catch {
      return null;
    }
  }

  protected mapPaymentToSerializedPayment(payment: Payment): SerializedPayment {
    return {
      a: payment.amount.toString(),
      d: payment.data,
      as: payment.asset,
      su: payment.successUrl?.toString(),
      cu: payment.cancelUrl?.toString(),
      c: payment.created.getTime(),
      e: payment.expired?.getTime(),
    };
  }
}
