
import { MichelsonType, packDataBytes } from '@taquito/michel-codec';

import { Payment, EncodedPaymentSignPayload } from '../../models';
import { optimization } from '../../utils';
import { contractPaymentInTezSignPayloadMichelsonType, contractPaymentInAssetSignPayloadMichelsonType } from './michelsonTypes';

export class PaymentSignPayloadEncoder {
  protected static readonly contractPaymentInTezSignPayloadMichelsonType: MichelsonType = contractPaymentInTezSignPayloadMichelsonType;
  protected static readonly contractPaymentInAssetSignPayloadMichelsonType: MichelsonType = contractPaymentInAssetSignPayloadMichelsonType;

  encode(payment: Payment): EncodedPaymentSignPayload {
    return {
      contractSignPayload: this.getContractSignPayload(payment),
      clientSignPayload: this.getClientSignPayload(payment)
    };
  }

  protected getContractSignPayload(payment: Payment): EncodedPaymentSignPayload['contractSignPayload'] {
    const signPayload = payment.asset
      ? packDataBytes(
        {
          prim: 'Pair',
          args: [
            {
              prim: 'Pair',
              args: [
                { string: payment.id },
                { string: payment.targetAddress }
              ]
            },
            {
              prim: 'Pair',
              args: [
                { int: payment.amount.toFormat(optimization.emptyObject) },
                { string: payment.asset }
              ]
            }
          ]
        },
        contractPaymentInAssetSignPayloadMichelsonType
      )
      : packDataBytes(
        {
          prim: 'Pair',
          args: [
            {
              prim: 'Pair',
              args: [
                { string: payment.id },
                { string: payment.targetAddress }
              ]
            },
            { int: payment.amount.toFormat(optimization.emptyObject) }
          ]
        },
        contractPaymentInTezSignPayloadMichelsonType
      );

    return signPayload.bytes;
  }

  protected getClientSignPayload(payment: Payment): EncodedPaymentSignPayload['clientSignPayload'] {
    return (
      (payment.successUrl ? payment.successUrl.href : '')
      + (payment.cancelUrl ? payment.cancelUrl.href : '')
    ) || null;
  }
}
