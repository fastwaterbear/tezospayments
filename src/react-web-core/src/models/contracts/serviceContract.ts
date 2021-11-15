import type { ContractAbstraction, ContractMethod, ContractProvider, MichelsonMap, Wallet } from '@taquito/taquito';

import type { ServiceOperationType } from '@tezospayments/common';

export type TezosPaymentsServiceContract<T extends ContractProvider | Wallet = ContractProvider> = ContractAbstraction<T> & {
  methodsObject: {
    send_payment(params: {
      id: string,
      signature: string,
      asset_value?: {
        token_address: string,
        token_id: number | null,
        value: string,
      }
    }): ContractMethod<T>;

    set_pause(paused: boolean): ContractMethod<T>;
    set_deleted(deleted: boolean): ContractMethod<T>;
    update_service_parameters(params: {
      metadata?: string,
      allowed_tokens?: {
        tez?: boolean,
        assets?: readonly string[]
      },
      allowed_operation_type?: ServiceOperationType
    }): ContractMethod<T>;
    update_signing_keys(
      signingKeys: MichelsonMap<string, { public_key: string, name?: string } | undefined>
    ): ContractMethod<T>;

    send_donation(params: {
      payload: string,
      asset_value?: {
        token_address: string,
        token_id: number | null,
        value: string,
      }
    }): ContractMethod<T>;
  }
};
