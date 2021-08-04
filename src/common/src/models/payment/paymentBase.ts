import { URL } from '../../native';

export enum PaymentType {
  Payment = 1,
  Donation = 2
}

export type PaymentUrl =
  | { type: 'base64', url: URL };

export interface PaymentBase {
  readonly type: PaymentType;
  readonly targetAddress: string;
  readonly urls: readonly PaymentUrl[];
}
