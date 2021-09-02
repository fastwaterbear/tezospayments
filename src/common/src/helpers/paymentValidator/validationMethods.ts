import BigNumber from 'bignumber.js';

import { tezosInfo } from '../../models/blockchain';
import { Payment } from '../../models/payment';
import type { FailedValidationResults } from '../../models/validation';
import { URL } from '../../native';
import { guards } from '../../utils';

type Errors<FieldNames extends string> = {
  readonly [P in FieldNames]: string;
};

export const validateTargetAddress = (
  targetAddress: string,
  errors: Errors<'invalidTargetAddress' | 'targetAddressHasInvalidLength' | 'targetAddressIsNotNetworkAddress'>
): FailedValidationResults => {
  if (typeof targetAddress !== 'string')
    return [errors.invalidTargetAddress];

  if (targetAddress.length !== tezosInfo.addressLength)
    return [errors.targetAddressHasInvalidLength];

  if (!tezosInfo.addressPrefixes.some(prefix => targetAddress.startsWith(prefix)))
    return [errors.targetAddressIsNotNetworkAddress];
};

export const validateAmount = (
  amount: BigNumber,
  errors: Errors<'invalidAmount' | 'amountIsNonPositive'>
): FailedValidationResults => {
  if (!BigNumber.isBigNumber(amount) || amount.isNaN() || !amount.isFinite())
    return [errors.invalidAmount];

  if (amount.isZero() || amount.isNegative())
    return [errors.amountIsNonPositive];
};

export const validateDesiredAmount = (
  desiredAmount: BigNumber | undefined,
  errors: Errors<'invalidAmount' | 'amountIsNonPositive'>
): FailedValidationResults => {
  return desiredAmount === undefined ? undefined : validateAmount(desiredAmount, errors);
};

export const validateAsset = (
  asset: string | undefined,
  errors: Errors<'invalidAsset' | 'assetHasInvalidLength' | 'assetIsNotContractAddress'>
): FailedValidationResults => {
  if (asset === undefined)
    return;

  if (typeof asset !== 'string')
    return [errors.invalidAsset];

  if (asset.length !== tezosInfo.addressLength)
    return [errors.assetHasInvalidLength];

  if (!tezosInfo.contractAddressPrefixes.some(prefix => asset.startsWith(prefix)))
    return [errors.assetIsNotContractAddress];
};

export const validateCreatedDate = (
  date: Date,
  errors: Errors<'invalidCreatedDate'>
): FailedValidationResults => {
  if (!(date instanceof Date) || isNaN(date.getTime()))
    return [errors.invalidCreatedDate];
};

export const validateUrl = (
  url: URL | undefined,
  errors: Errors<'invalidUrl' | 'invalidProtocol'>
): FailedValidationResults => {
  if (url === undefined)
    return;

  if (!(url instanceof URL))
    return [errors.invalidUrl];

  if (url.protocol.indexOf('javascript') > -1)
    return [errors.invalidProtocol];
};

export const validateExpiredDate = (
  expiredDate: Date | undefined,
  createdDate: Date,
  minimumPaymentLifetime: number,
  errors: Errors<'invalidExpiredDate' | 'paymentLifetimeIsShort'>
): FailedValidationResults => {
  if (expiredDate === undefined)
    return;

  if (!(expiredDate instanceof Date) || isNaN(expiredDate.getTime()))
    return [errors.invalidExpiredDate];

  if (expiredDate.getTime() - createdDate.getTime() < minimumPaymentLifetime) {
    return [errors.paymentLifetimeIsShort];
  }
};

export const validateData = (
  data: Payment['data'],
  errors: Errors<'invalidData' | 'invalidPublicData' | 'publicDataShouldBeFlat' | 'invalidPrivateData' | 'privateDataShouldBeFlat'>
): FailedValidationResults => {
  if (!guards.isPlainObject(data) || Object.keys(data).some(key => key !== 'public' && key !== 'private'))
    return [errors.invalidData];

  const publicData = (data as Exclude<Payment['data'], { private: unknown }>).public;
  const privateData = (data as Exclude<Payment['data'], { public: unknown }>).private;
  if (!(publicData || privateData))
    return [errors.invalidData];

  if (publicData !== undefined) {
    if (!guards.isPlainObject(publicData))
      return [errors.invalidPublicData];
    if (!isFlatObject(publicData))
      return [errors.publicDataShouldBeFlat];
  }

  if (privateData !== undefined) {
    if (!guards.isPlainObject(privateData))
      return [errors.invalidPrivateData];
    if (!isFlatObject(privateData))
      return [errors.privateDataShouldBeFlat];
  }
};

const isFlatObject = (obj: Record<string, unknown>) => {
  for (const propertyName of Object.getOwnPropertyNames(obj)) {
    const property = obj[propertyName];
    if (typeof property === 'object' || typeof property === 'function')
      return false;
  }

  return true;
};
