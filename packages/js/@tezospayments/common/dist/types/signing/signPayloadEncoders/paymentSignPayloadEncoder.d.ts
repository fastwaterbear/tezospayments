import { MichelsonType } from '@taquito/michel-codec';
import type { UnsignedPayment, EncodedPaymentSignPayload } from '../../models';
export declare class PaymentSignPayloadEncoder {
    protected static readonly contractPaymentInTezSignPayloadMichelsonType: MichelsonType;
    protected static readonly contractPaymentInAssetSignPayloadMichelsonType: MichelsonType;
    encode(payment: UnsignedPayment): EncodedPaymentSignPayload;
    protected getContractSignPayload(payment: UnsignedPayment): EncodedPaymentSignPayload['contractSignPayload'];
    protected getClientSignPayload(payment: UnsignedPayment): EncodedPaymentSignPayload['clientSignPayload'];
}
