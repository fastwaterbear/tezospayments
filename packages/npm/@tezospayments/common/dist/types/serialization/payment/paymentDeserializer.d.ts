import type { NonSerializedPaymentSlice, Payment, PaymentAsset, PaymentSignature, SerializedPayment, SerializedPaymentAsset, SerializedPaymentSignature } from '../../models';
import { Base64Deserializer } from '../base64';
export declare class PaymentDeserializer {
    protected static readonly serializedPaymentBase64Deserializer: Base64Deserializer<SerializedPayment>;
    deserialize(serializedPaymentBase64: string, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment | null;
    protected mapSerializedPaymentToPayment(serializedPayment: SerializedPayment, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment;
    protected mapSerializedPaymentAssetToPaymentAsset(serializedPaymentAsset: SerializedPaymentAsset): PaymentAsset;
    protected mapSerializedPaymentSignatureToPaymentSignature(serializedPaymentSignature: SerializedPaymentSignature): PaymentSignature;
}
