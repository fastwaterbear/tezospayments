
import { converters } from '../../utils';
import { StateModel } from '../core';
import { Operation } from './operation';
import { OperationDirection } from './operationDirection';
import { OperationType } from './operationType';

export interface DonationOperation extends Operation {
  readonly type: OperationType.Donation;
  readonly direction: OperationDirection.Incoming;
  readonly payload?: DonationOperationPayload;
}

export interface DonationOperationPayload {
  readonly value: { readonly [fieldName: string]: unknown; } | null;
  readonly valueString: string;
  readonly encodedValue: string;
}

export class DonationOperation extends StateModel {
  static parsePayload(encodedValue: string): DonationOperationPayload {
    const valueString = converters.bytesToString(encodedValue);

    let value: DonationOperationPayload['value'] = null;
    try { value = JSON.parse(valueString); } catch { /**/ }

    return {
      value,
      valueString,
      encodedValue,
    };
  }
}
