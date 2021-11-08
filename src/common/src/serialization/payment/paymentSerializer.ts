import type { Payment, PaymentSignature, SerializedPayment, SerializedPaymentSignature } from '../../models';
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
      i: payment.id,
      a: payment.amount.toString(),
      d: payment.data,
      as: payment.asset,
      su: payment.successUrl?.toString(),
      cu: payment.cancelUrl?.toString(),
      c: payment.created.getTime(),
      e: payment.expired?.getTime(),
      s: this.mapPaymentSignatureToSerializedPaymentSignature(payment.signature)
    };
  }

  protected mapPaymentSignatureToSerializedPaymentSignature(paymentSignature: PaymentSignature): SerializedPaymentSignature {
    return {
      k: paymentSignature.signingPublicKey,
      c: paymentSignature.contract,
      cl: paymentSignature.client
    };
  }
}
