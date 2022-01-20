import type { Payment, PaymentAsset, PaymentSignature, SerializedPayment, SerializedPaymentAsset, SerializedPaymentSignature } from '../../models';
import { Base64Deserializer } from '../base64';
export declare class PaymentDeserializer {
    protected static readonly serializedPaymentBase64Deserializer: Base64Deserializer<SerializedPayment>;
    deserialize(serializedPaymentBase64: string): Payment | null;
    protected mapSerializedPaymentToPayment(serializedPayment: SerializedPayment): Payment;
    protected mapSerializedPaymentAssetToPaymentAsset(serializedPaymentAsset: SerializedPaymentAsset): PaymentAsset;
    protected mapSerializedPaymentSignatureToPaymentSignature(serializedPaymentSignature: SerializedPaymentSignature): PaymentSignature;
}
