import { UnsignedPayment, PaymentSignature, PaymentSignPayloadEncoder } from '@tezospayments/common';

import { SigningType } from '../models';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';

export class WalletSigner extends TezosPaymentsSigner {
  protected readonly paymentSignPayloadEncoder: PaymentSignPayloadEncoder = new PaymentSignPayloadEncoder();

  constructor(readonly walletSigning: (dataBytes: string) => Promise<string>) {
    super(SigningType.Wallet);
  }

  async sign(payment: UnsignedPayment): Promise<PaymentSignature> {
    const signPayload = this.paymentSignPayloadEncoder.encode(payment);
    const walletContractSignPayload = signPayload.contractSignPayload.substring(2);

    const contractSigningPromise = this.walletSigning(walletContractSignPayload);
    const signingPromises = signPayload.clientSignPayload
      ? [contractSigningPromise, this.walletSigning(signPayload.clientSignPayload)]
      : [contractSigningPromise];

    // TODO: add "[Awaited<ReturnType<typeof this.inMemorySigner.sign>>, Awaited<ReturnType<typeof this.inMemorySigner.sign>>?]" type
    const signatures = await Promise.all(signingPromises);

    return {
      signingPublicKey: '',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      contract: signatures[0]!,
      client: signatures[1],
    };
  }
}
