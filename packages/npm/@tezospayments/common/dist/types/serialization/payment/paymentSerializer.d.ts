import type { Payment, SerializedPayment } from '../../models';
import { Base64Serializer } from '../base64';
export declare class PaymentSerializer {
    protected static readonly serializedPaymentBase64Serializer: Base64Serializer<SerializedPayment>;
    serialize(payment: Payment): string | null;
    protected mapPaymentToSerializedPayment(payment: Payment): SerializedPayment;
}
