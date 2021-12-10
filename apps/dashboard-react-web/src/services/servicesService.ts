import { MichelsonMap, TezosToolkit, TransactionWalletOperation, Wallet } from '@taquito/taquito';

import type { Service, ServiceOperation, ServiceSigningKey } from '@tezospayments/common';
import type { ServicesProvider, TezosPaymentsFactoryImplementationContract, TezosPaymentsServiceContract } from '@tezospayments/react-web-core';

import type { Account } from '../models/blockchain';
import type { ServiceFactoryStorage } from '../models/contracts';

export class ServicesService {
  constructor(
    private readonly tezosToolkit: TezosToolkit,
    private readonly servicesProvider: ServicesProvider,
    private readonly servicesFactoryContractAddress: string
  ) {
  }

  async getServices(account: Account): Promise<readonly Service[]> {
    return this.servicesProvider.getServices(account.address);
  }

  async getService(serviceContractAddress: string): Promise<Service> {
    return this.servicesProvider.getService(serviceContractAddress);
  }

  async getOperations(serviceContractAddress: string): Promise<readonly ServiceOperation[]> {
    return this.servicesProvider.getOperations(serviceContractAddress);
  }

  async updateService(service: Service): Promise<TransactionWalletOperation> {
    const serviceContract = await this.getServiceContract(service.contractAddress);
    const encodedServiceMetadata = this.encodeMetadata(service);
    return await serviceContract.methodsObject.update_service_parameters({
      metadata: encodedServiceMetadata,
      allowed_tokens: {
        tez: service.allowedTokens.tez,
        assets: [...service.allowedTokens.assets] // immerjs fix (without it we will fail in taquito on sorting the array)
      },
      allowed_operation_type: service.allowedOperationType
    }).send();
  }

  async setPaused(service: Service, paused: boolean): Promise<TransactionWalletOperation> {
    const serviceContract = await this.getServiceContract(service.contractAddress);
    return await serviceContract.methodsObject.set_pause(paused).send();
  }

  async setDeleted(service: Service, deleted: boolean): Promise<TransactionWalletOperation> {
    const serviceContract = await this.getServiceContract(service.contractAddress);
    return await serviceContract.methodsObject.set_deleted(deleted).send();
  }

  async createService(service: Service): Promise<TransactionWalletOperation> {
    const factoryContract = await this.tezosToolkit.contract.at(this.servicesFactoryContractAddress);
    const factoryStorage = await factoryContract.storage<ServiceFactoryStorage>();
    const factoryImplementationContract = await this.getFactoryImplementationContract(factoryStorage.factory_implementation);

    const encodedServiceMetadata = this.encodeMetadata(service);

    const signingKeysMichelsonMap = new MichelsonMap<string, { public_key: string, name?: string }>();
    for (const signingKey of service.signingKeys.values())
      signingKeysMichelsonMap.set(signingKey.publicKey, { public_key: signingKey.publicKey, name: signingKey.name });

    return await factoryImplementationContract.methodsObject.create_service({
      metadata: encodedServiceMetadata,
      allowed_tokens: {
        tez: service.allowedTokens.tez,
        assets: service.allowedTokens.assets,
      },
      allowed_operation_type: service.allowedOperationType,
      signing_keys: signingKeysMichelsonMap
    }).send();
  }

  addApiKey(service: Service, signingKey: ServiceSigningKey): Promise<TransactionWalletOperation> {
    const signingKeyUpdatesMap = new MichelsonMap<string, { public_key: string, name?: string }>();
    signingKeyUpdatesMap.set(signingKey.publicKey, { public_key: signingKey.publicKey, name: signingKey.name });

    return this.updateSigningKeys(service, signingKeyUpdatesMap);
  }

  deleteApiKey(service: Service, publicKey: ServiceSigningKey['publicKey']): Promise<TransactionWalletOperation> {
    const signingKeyUpdatesMap = new MichelsonMap<string, undefined>();
    signingKeyUpdatesMap.set(publicKey, undefined);

    return this.updateSigningKeys(service, signingKeyUpdatesMap);
  }

  private async updateSigningKeys(
    service: Service,
    signingKeyUpdatesMap: MichelsonMap<string, { public_key: string, name?: string } | undefined>
  ): Promise<TransactionWalletOperation> {
    const serviceContract = await this.getServiceContract(service.contractAddress);
    return await serviceContract.methodsObject.update_signing_keys(signingKeyUpdatesMap).send();
  }

  private encodeMetadata(service: Service): string {
    const serviceMetadata = {
      name: service.name || undefined,
      links: service.links.length ? service.links : undefined,
      description: service.description || undefined,
      iconUrl: service.iconUrl || undefined
    };

    return Buffer.from(JSON.stringify(serviceMetadata), 'utf8').toString('hex');
  }

  private async getServiceContract(contractAddress: string): Promise<TezosPaymentsServiceContract<Wallet>> {
    return await this.tezosToolkit.wallet.at<TezosPaymentsServiceContract<Wallet>>(contractAddress);
  }

  private async getFactoryImplementationContract(contractAddress: string): Promise<TezosPaymentsFactoryImplementationContract<Wallet>> {
    return await this.tezosToolkit.wallet.at<TezosPaymentsFactoryImplementationContract<Wallet>>(contractAddress);
  }
}
