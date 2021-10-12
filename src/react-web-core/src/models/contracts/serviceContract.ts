import type { ContractAbstraction, ContractMethod, ContractProvider, MichelsonMap, Wallet } from '@taquito/taquito';
import type { BigNumber } from 'bignumber.js';

import type { ServiceOperationType } from '@tezospayments/common';

export type TezosPaymentsServiceContract<T extends ContractProvider | Wallet = ContractProvider> = ContractAbstraction<T> & {
  methods: {
    set_pause(paused: boolean): ContractMethod<T>;
    set_deleted(deleted: boolean): ContractMethod<T>;
    update_service_parameters(
      encodedServiceMetadata: string,
      allowTezos: boolean,
      allowedAssets: readonly string[],
      allowedOperationType: ServiceOperationType
    ): ContractMethod<T>;
    update_signing_keys(
      signingKeys: MichelsonMap<string, { public_key: string, name?: string } | undefined>
    ): ContractMethod<T>;
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
