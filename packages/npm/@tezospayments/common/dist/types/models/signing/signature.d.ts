export interface PaymentSignature {
    readonly signingPublicKey: string;
    readonly contract: string;
    readonly client?: string;
}
export interface DonationSignature {
    readonly signingPublicKey: string;
    readonly client: string;
}
