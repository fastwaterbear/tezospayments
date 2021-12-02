
import { MichelsonType, packDataBytes } from '@taquito/michel-codec';

import type { UnsignedPayment, EncodedPaymentSignPayload } from '../../models';
import { tezToMutez, tokensAmountToNat } from '../../utils/converters';
import { contractPaymentInTezSignPayloadMichelsonType, contractPaymentInAssetSignPayloadMichelsonType } from './michelsonTypes';

export class PaymentSignPayloadEncoder {
  protected static readonly contractPaymentInTezSignPayloadMichelsonType: MichelsonType = contractPaymentInTezSignPayloadMichelsonType;
  protected static readonly contractPaymentInAssetSignPayloadMichelsonType: MichelsonType = contractPaymentInAssetSignPayloadMichelsonType;

  encode(payment: UnsignedPayment): EncodedPaymentSignPayload {
    return {
      contractSignPayload: this.getContractSignPayload(payment),
      clientSignPayload: this.getClientSignPayload(payment)
    };
  }

  protected getContractSignPayload(payment: UnsignedPayment): EncodedPaymentSignPayload['contractSignPayload'] {
    const signPayload = payment.asset
      ? packDataBytes(
        {
          prim: 'Pair',
          args: [
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
                    { int: tokensAmountToNat(payment.amount, payment.asset.decimals).toString(10) },
                    { string: payment.asset.address }
                  ]
                }
              ]
            },
            payment.asset.id !== undefined && payment.asset.id !== null
              ? { prim: 'Some', args: [{ int: payment.asset.id.toString() }] }
              : { prim: 'None' }
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
            { int: tezToMutez(payment.amount).toString(10) }
          ]
        },
        contractPaymentInTezSignPayloadMichelsonType
      );

    return '0x' + signPayload.bytes;
  }

  protected getClientSignPayload(payment: UnsignedPayment): EncodedPaymentSignPayload['clientSignPayload'] {
    return (
      (payment.successUrl ? payment.successUrl.href : '')
      + (payment.cancelUrl ? payment.cancelUrl.href : '')
    ) || null;
  }
}
