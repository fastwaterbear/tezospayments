import { PaymentUrlType, DeepReadonly, UnsignedPayment as CommonUnsignedPaymentModel, Payment as CommonPaymentModel, PaymentValidator, Network, CustomNetwork } from '@tezospayments/common';
import { Payment } from './models';
import type { DefaultPaymentParameters, PaymentCreateParameters, TezosPaymentsOptions } from './options';
import { PaymentUrlFactory } from './paymentUrlFactories';
import { TezosPaymentsSigner } from './signers';
import { TezosPaymentsOptionsValidator } from './validation';
export declare class TezosPayments {
    static readonly defaultPaymentParameters: DeepReadonly<DefaultPaymentParameters>;
    protected readonly optionsValidator: TezosPaymentsOptionsValidator;
    protected readonly paymentValidator: PaymentValidator;
    protected readonly serviceContractAddress: string;
    protected readonly signer: TezosPaymentsSigner;
    protected readonly network: Network | CustomNetwork;
    protected readonly defaultPaymentParameters: DeepReadonly<DefaultPaymentParameters>;
    private paymentUrlFactories;
    constructor(options: DeepReadonly<TezosPaymentsOptions>);
    createPayment(createParameters: PaymentCreateParameters): Promise<Payment>;
    protected getPaymentUrl(payment: CommonPaymentModel, urlType?: PaymentUrlType): string | Promise<string>;
    protected applyPaymentUrl(payment: CommonPaymentModel, url: string): Payment;
    protected getPaymentUrlFactory(paymentUrlType: PaymentUrlType): PaymentUrlFactory;
    protected getSignedPayment(unsignedPayment: CommonUnsignedPaymentModel): Promise<CommonPaymentModel>;
    protected createSigner(signingOptions: TezosPaymentsOptions['signing']): TezosPaymentsSigner;
    protected createPaymentUrlFactory(paymentUrlType: PaymentUrlType): PaymentUrlFactory;
    protected createPaymentByCreateParameters(createParameters: PaymentCreateParameters): CommonUnsignedPaymentModel;
}
