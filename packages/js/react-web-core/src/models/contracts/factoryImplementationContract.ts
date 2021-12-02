import type { ContractAbstraction, ContractMethod, ContractProvider, MichelsonMap, Wallet } from '@taquito/taquito';

import type { ServiceOperationType } from '@tezospayments/common';

export type TezosPaymentsFactoryImplementationContract<T extends ContractProvider | Wallet = ContractProvider> = ContractAbstraction<T> & {
  methodsObject: {
    create_service(params: {
      metadata: string,
      allowed_tokens: {
        tez: boolean,
        assets: readonly string[],
      },
      allowed_operation_type: ServiceOperationType,
      signing_keys: MichelsonMap<string, { public_key: string, name?: string } | undefined>
    }): ContractMethod<T>;
  }
};
