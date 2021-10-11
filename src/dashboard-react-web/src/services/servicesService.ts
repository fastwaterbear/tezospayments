import { MichelsonMap, TezosToolkit, TransactionWalletOperation } from '@taquito/taquito';

import type { Service, ServiceOperation, ServiceSigningKey } from '@tezospayments/common';
import type { ServicesProvider } from '@tezospayments/react-web-core';

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

  async updateService(service: Service): Promise<TransactionWalletOperation | null> {
    try {
      const factoryContract = await this.tezosToolkit.wallet.at(service.contractAddress);

      if (factoryContract.methods.update_service_parameters) {
        const encodedServiceMetadata = this.encodeMetadata(service);

        const operation = await factoryContract.methods.update_service_parameters(
          encodedServiceMetadata,
          service.allowedTokens.tez,
          service.allowedTokens.assets,
          service.allowedOperationType
        ).send();

        return operation;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async setPaused(service: Service, paused: boolean): Promise<TransactionWalletOperation | null> {
    try {
      const factoryContract = await this.tezosToolkit.wallet.at(service.contractAddress);

      if (factoryContract.methods.set_pause) {
        const operation = await factoryContract.methods.set_pause(paused).send();

        return operation;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async setDeleted(service: Service, deleted: boolean): Promise<TransactionWalletOperation | null> {
    try {
      const factoryContract = await this.tezosToolkit.wallet.at(service.contractAddress);

      if (factoryContract.methods.set_deleted) {
        const operation = await factoryContract.methods.set_deleted(deleted).send();

        return operation;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async createService(service: Service): Promise<TransactionWalletOperation | null> {
    try {
      const factoryContract = await this.tezosToolkit.contract.at(this.servicesFactoryContractAddress);

      const factoryStorage = await factoryContract.storage<ServiceFactoryStorage>();
      const factoryImplementationContract = await this.tezosToolkit.wallet.at(factoryStorage.factory_implementation);

      if (factoryImplementationContract.methods.create_service) {
        const encodedServiceMetadata = this.encodeMetadata(service);

        const operation = await factoryImplementationContract.methods.create_service(
          encodedServiceMetadata,
          service.allowedTokens.tez,
          service.allowedTokens.assets,
          service.allowedOperationType,
          new MichelsonMap()
        ).send();

        return operation;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  addApiKey(service: Service, signingKey: ServiceSigningKey): Promise<TransactionWalletOperation | null> {
    const signingKeyUpdatesMap = new MichelsonMap<string, { public_key: string, name?: string }>();
    signingKeyUpdatesMap.set(signingKey.publicKey, { public_key: signingKey.publicKey, name: signingKey.name });

    return this.updateSigningKeys(service, signingKeyUpdatesMap);
  }

  deleteApiKey(service: Service, publicKey: ServiceSigningKey['publicKey']): Promise<TransactionWalletOperation | null> {
    const signingKeyUpdatesMap = new MichelsonMap<string, undefined>();
    signingKeyUpdatesMap.set(publicKey, undefined);

    return this.updateSigningKeys(service, signingKeyUpdatesMap);
  }

  private async updateSigningKeys(
    service: Service,
    signingKeyUpdatesMap: MichelsonMap<string, { public_key: string, name?: string } | undefined>
  ): Promise<TransactionWalletOperation | null> {
    try {
      const serviceContract = await this.tezosToolkit.wallet.at(service.contractAddress);
      if (serviceContract.methods.update_signing_keys) {
        const operation = await serviceContract.methods.update_signing_keys(signingKeyUpdatesMap).send();

        return operation;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  private encodeMetadata(service: Service) {
    const serviceMetadata = {
      name: service.name || undefined,
      links: service.links.length ? service.links : undefined,
      description: service.description || undefined,
      iconUrl: service.iconUrl || undefined
    };

    return Buffer.from(JSON.stringify(serviceMetadata), 'utf8').toString('hex');
  }
}
