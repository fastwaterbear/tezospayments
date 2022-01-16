import type {
  Payment, PaymentAsset, PaymentSignature,
  SerializedPayment, SerializedPaymentAsset, SerializedPaymentSignature
} from '../../models';
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
      t: payment.targetAddress,
      as: payment.asset ? this.mapPaymentAssetToSerializedPaymentAsset(payment.asset) : undefined,
      d: payment.data,
      su: payment.successUrl?.toString(),
      cu: payment.cancelUrl?.toString(),
      c: payment.created.getTime(),
      e: payment.expired?.getTime(),
      s: this.mapPaymentSignatureToSerializedPaymentSignature(payment.signature)
    };
  }

  protected mapPaymentAssetToSerializedPaymentAsset(paymentAsset: PaymentAsset): SerializedPaymentAsset {
    return {
      a: paymentAsset.address,
      d: paymentAsset.decimals,
      i: paymentAsset.id !== null ? paymentAsset.id : undefined
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
