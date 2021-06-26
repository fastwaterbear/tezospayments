import { BigNumber } from 'bignumber.js';

import { converters } from '../../utils';
import { StateModel } from '../core';
import { ServiceOperationDirection } from './serviceOperationDirection';
import { ServiceOperationStatus } from './serviceOperationStatus';
import { ServiceOperationType } from './serviceOperationType';

interface ServiceOperationPayloadData {
  readonly value: { readonly [fieldName: string]: unknown; } | null;
  readonly valueString: string;
  readonly encodedValue: string;
}

interface PublicServiceOperationPayload {
  readonly public: ServiceOperationPayloadData;
}

interface PrivateServiceOperationPayload {
  readonly private: ServiceOperationPayloadData;
}

type ServiceOperationPayload =
  | PublicServiceOperationPayload
  | PrivateServiceOperationPayload
  | PublicServiceOperationPayload & PrivateServiceOperationPayload;


export interface ServiceOperation {
  readonly hash: string;
  readonly type: ServiceOperationType;
  readonly direction: ServiceOperationDirection;
  readonly status: ServiceOperationStatus;
  readonly amount: BigNumber;
  readonly payload: ServiceOperationPayload;
  readonly asset?: string;
  readonly timestamp: string;
  readonly date: Date;
  readonly sender: string;
  readonly target: string;
}

export class ServiceOperation extends StateModel {
  static publicPayloadExists(operation: ServiceOperation): operation is ServiceOperation & { readonly payload: PublicServiceOperationPayload } {
    return !!(operation.payload as PublicServiceOperationPayload).public;
  }

  static privatePayloadExists(operation: ServiceOperation): operation is ServiceOperation & { readonly payload: PrivateServiceOperationPayload } {
    return !!(operation.payload as PrivateServiceOperationPayload).private;
  }

  static isPayloadDecoded(
    data: ServiceOperationPayloadData
  ): data is ServiceOperationPayloadData & { readonly value: NonNullable<ServiceOperationPayloadData['value']> } {
    return !!data.value;
  }

  static parseServiceOperationPayload(encodedValue: string): ServiceOperationPayloadData {
    const valueString = converters.bytesToString(encodedValue);

    let value: ServiceOperationPayloadData['value'] = null;
    try { value = JSON.parse(valueString); } catch { /**/ }

    return {
      value,
      valueString,
      encodedValue,
    };
  }
}
