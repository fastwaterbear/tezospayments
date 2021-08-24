import { DeepReadonly, FailedValidationResults, tezosInfo } from '@tezospayments/common';

import { InvalidTezosPaymentsOptionsError } from './errors';
import type { Payment } from './models';
import type { PaymentCreateParameters, TezosPaymentsOptions } from './options';

export class TezosPayments {
  protected static readonly errors = {
    invalidServiceContractAddressType: 'Type of the serviceContractAddress option is invalid',
    serviceContractAddressHasInvalidLength: 'The serviceContractAddress option has an invalid address',
    serviceContractAddressIsNotContractAddress: 'The serviceContractAddress option isn\'t a contract address'
  } as const;


  constructor(protected readonly options: DeepReadonly<TezosPaymentsOptions>) {
    const errors = this.validateCurrentOptions();
    if (errors)
      throw new InvalidTezosPaymentsOptionsError(errors);
  }

  async createPayment(_createParameters: PaymentCreateParameters): Promise<Payment> {
    throw new Error('Method not implemented.');
  }

  protected validateCurrentOptions(): FailedValidationResults {
    return [
      this.validateServiceContractAddress(this.options.serviceContractAddress)
    ].reduce(
      (result, currentErrors) => currentErrors ? (result || []).concat(currentErrors) : undefined,
      undefined
    );
  }

  private validateServiceContractAddress(serviceContractAddress: string): FailedValidationResults {
    if (!serviceContractAddress || typeof serviceContractAddress !== 'string')
      return [TezosPayments.errors.invalidServiceContractAddressType];

    if (serviceContractAddress.length !== tezosInfo.addressLength)
      return [TezosPayments.errors.serviceContractAddressHasInvalidLength];

    if (!tezosInfo.contractAddressPrefixes.some(prefix => serviceContractAddress.startsWith(prefix)))
      return [TezosPayments.errors.serviceContractAddressIsNotContractAddress];
  }
}
