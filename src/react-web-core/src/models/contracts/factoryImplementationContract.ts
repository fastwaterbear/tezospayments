import type { ContractAbstraction, ContractMethod, ContractProvider, MichelsonMap, Wallet } from '@taquito/taquito';

import type { ServiceOperationType } from '@tezospayments/common';

export type TezosPaymentsFactoryImplementationContract<T extends ContractProvider | Wallet = ContractProvider> = ContractAbstraction<T> & {
  methods: {
    create_service(
      encodedServiceMetadata: string,
      allowTezos: boolean,
      allowedAssets: readonly string[],
      allowedOperationType: ServiceOperationType,
      signingKeys: MichelsonMap<string, { public_key: string, name?: string } | undefined>
    ): ContractMethod<T>;
  }
};
