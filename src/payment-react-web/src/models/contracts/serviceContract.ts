import type { ContractAbstraction, ContractMethod, ContractProvider, Wallet } from '@taquito/taquito';
import type { BigNumber } from 'bignumber.js';

import type { ServiceOperationType } from '@tezospayments/common';

export type TezosPaymentsServiceContract<T extends ContractProvider | Wallet = ContractProvider> = ContractAbstraction<T> & {
  methods: {
    send_payment(
      assetTokenAddress: void,
      operationType: ServiceOperationType,
      payloadType: 'public' | 'private',
      payload: string
    ): ContractMethod<T>;
    send_payment(
      assetTokenAddress: void,
      operationType: ServiceOperationType,
      payloadType: 'public_and_private',
      publicPayload: string,
      privatePayload: string
    ): ContractMethod<T>;
    send_payment(
      assetTokenAddress: string,
      assetValue: BigNumber,
      operationType: ServiceOperationType,
      payloadType: 'public' | 'private',
      payload: string
    ): ContractMethod<T>;
    send_payment(
      assetTokenAddress: string,
      assetValue: BigNumber,
      operationType: ServiceOperationType,
      payloadType: 'public_and_private',
      publicPayload: string,
      privatePayload: string
    ): ContractMethod<T>;
  }
};
