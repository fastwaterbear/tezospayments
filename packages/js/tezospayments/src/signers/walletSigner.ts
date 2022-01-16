import { UnsignedPayment, PaymentSignature, PaymentSignPayloadEncoder } from '@tezospayments/common';

import { SigningType } from '../models';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';

export class WalletSigner extends TezosPaymentsSigner {
  protected readonly paymentSignPayloadEncoder: PaymentSignPayloadEncoder = new PaymentSignPayloadEncoder();

  constructor(readonly signingPublicKey: string, readonly walletSignCallback: (dataBytes: string) => Promise<string>) {
    super(SigningType.Wallet);
  }

  async sign(payment: UnsignedPayment): Promise<PaymentSignature> {
    const signPayload = this.paymentSignPayloadEncoder.encode(payment);
    const walletContractSignPayload = signPayload.contractSignPayload.substring(2);

    const contractSigningPromise = this.walletSignCallback(walletContractSignPayload);
    const signingPromises = signPayload.clientSignPayload
      ? [contractSigningPromise, this.walletSignCallback(signPayload.clientSignPayload)] as const
      : [contractSigningPromise] as const;

    const signatures = await Promise.all(signingPromises);

    return {
      signingPublicKey: this.signingPublicKey,
      contract: signatures[0],
      client: signatures[1],
    };
  }
}
