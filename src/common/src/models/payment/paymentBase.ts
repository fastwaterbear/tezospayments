import { BigNumber } from 'bignumber.js';

import { URL } from '../../native';
import { StateModel } from '../core';

export enum PaymentType {
  Payment = 1,
  Donation = 2
}

export type PaymentUrl =
  | { type: 'base64', url: URL };

export interface PaymentBase {
  readonly type: PaymentType;
  readonly targetAddress: string;
  readonly amount: BigNumber;
  readonly asset?: string;
  readonly created: Date;
  readonly successUrl?: URL;
  readonly cancelUrl?: URL;
  readonly urls: readonly PaymentUrl[];
}

export abstract class PaymentBase extends StateModel {
  static inTez(payment: PaymentBase) {
    return !!payment.asset;
  }
}
