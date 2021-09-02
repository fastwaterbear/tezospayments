import type { NonSerializedPaymentSlice, Payment, SerializedPayment } from '../../models';
import { Base64Deserializer } from '../base64';
export declare class PaymentDeserializer {
    protected static readonly serializedPaymentBase64Deserializer: Base64Deserializer<SerializedPayment>;
    deserialize(serializedPaymentBase64: string, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment | null;
    protected mapSerializedPaymentToPayment(serializedPayment: SerializedPayment, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment;
}
