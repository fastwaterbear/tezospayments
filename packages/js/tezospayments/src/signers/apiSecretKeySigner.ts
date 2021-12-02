import { InMemorySigner } from '@taquito/signer';

import { PaymentSignPayloadEncoder, PaymentSignature, UnsignedPayment } from '@tezospayments/common';

import { SigningType } from '../models';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';

export class ApiSecretKeySigner extends TezosPaymentsSigner {
  protected readonly paymentSignPayloadEncoder: PaymentSignPayloadEncoder = new PaymentSignPayloadEncoder();
  protected readonly inMemorySigner: InMemorySigner;

  constructor(readonly apiSecretKey: string) {
    super(SigningType.ApiSecretKey);

    this.inMemorySigner = new InMemorySigner(this.apiSecretKey);
  }

  async sign(payment: UnsignedPayment): Promise<PaymentSignature> {
    const signPayload = this.paymentSignPayloadEncoder.encode(payment);
    const contractSigningPromise = this.inMemorySigner.sign(signPayload.contractSignPayload);
    const signingPromises = signPayload.clientSignPayload
      ? [contractSigningPromise, this.inMemorySigner.sign(signPayload.clientSignPayload)]
      : [contractSigningPromise];

    // TODO: add "[Awaited<ReturnType<typeof this.inMemorySigner.sign>>, Awaited<ReturnType<typeof this.inMemorySigner.sign>>?]" type
    const signatures = await Promise.all(signingPromises);

    return {
      signingPublicKey: await this.inMemorySigner.publicKey(),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      contract: signatures[0]!.prefixSig,
      client: signatures[1]?.prefixSig,
    };
  }
}
