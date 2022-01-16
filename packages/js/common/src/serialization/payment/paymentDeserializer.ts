import BigNumber from 'bignumber.js';

import type {
  Payment, PaymentAsset, PaymentSignature,
  SerializedPayment, SerializedPaymentAsset, SerializedPaymentSignature
} from '../../models';
import { PaymentType } from '../../models/payment/paymentBase';
import { URL } from '../../native';
import { Base64Deserializer } from '../base64';
import { serializedPaymentFieldTypes } from './serializedPaymentFieldTypes';

export class PaymentDeserializer {
  protected static readonly serializedPaymentBase64Deserializer = new Base64Deserializer<SerializedPayment>(
    serializedPaymentFieldTypes
  );

  deserialize(serializedPaymentBase64: string): Payment | null {
    try {
      const serializedPayment = PaymentDeserializer.serializedPaymentBase64Deserializer.deserialize(serializedPaymentBase64);

      return serializedPayment ? this.mapSerializedPaymentToPayment(serializedPayment) : null;
    }
    catch {
      return null;
    }
  }

  protected mapSerializedPaymentToPayment(serializedPayment: SerializedPayment): Payment {
    return {
      type: PaymentType.Payment,
      id: serializedPayment.i,
      amount: new BigNumber(serializedPayment.a),
      targetAddress: serializedPayment.t,
      asset: serializedPayment.as ? this.mapSerializedPaymentAssetToPaymentAsset(serializedPayment.as) : undefined,
      data: serializedPayment.d,
      successUrl: serializedPayment.su ? new URL(serializedPayment.su) : undefined,
      cancelUrl: serializedPayment.cu ? new URL(serializedPayment.cu) : undefined,
      created: new Date(serializedPayment.c),
      expired: serializedPayment.e ? new Date(serializedPayment.e) : undefined,

      signature: this.mapSerializedPaymentSignatureToPaymentSignature(serializedPayment.s)
    };
  }

  protected mapSerializedPaymentAssetToPaymentAsset(serializedPaymentAsset: SerializedPaymentAsset): PaymentAsset {
    return {
      address: serializedPaymentAsset.a,
      decimals: serializedPaymentAsset.d,
      id: serializedPaymentAsset.i !== undefined ? serializedPaymentAsset.i : null
    };
  }

  protected mapSerializedPaymentSignatureToPaymentSignature(serializedPaymentSignature: SerializedPaymentSignature): PaymentSignature {
    return {
      signingPublicKey: serializedPaymentSignature.k,
      contract: serializedPaymentSignature.c,
      client: serializedPaymentSignature.cl
    };
  }
}
