import type { NonSerializedPaymentSlice, Payment, LegacySerializedPayment } from '../../models';
import { Base64Deserializer } from '../base64';
export declare class LegacyPaymentDeserializer {
    protected static readonly serializedPaymentBase64Deserializer: Base64Deserializer<LegacySerializedPayment>;
    deserialize(serializedPaymentBase64: string, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment | null;
    protected mapSerializedPaymentToPayment(serializedPayment: LegacySerializedPayment, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment;
}
