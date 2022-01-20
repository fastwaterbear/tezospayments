import type { Payment } from '../../models';
export interface ClientSignPayload {
    readonly successUrl?: string;
    readonly cancelUrl?: string;
    readonly data?: Payment['data'];
}
export declare const tezosSignedMessagePrefixBytes = "54657a6f73205369676e6564204d6573736167653a20";
export declare const tezosPaymentsClientSignedMessagePrefixBytes = "5061796d656e7420436c69656e7420446174613a20";
