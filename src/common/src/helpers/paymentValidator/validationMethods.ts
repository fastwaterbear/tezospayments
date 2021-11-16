import BigNumber from 'bignumber.js';

import { tezosInfo } from '../../models/blockchain';
import { DonationAsset, Payment, PaymentAsset } from '../../models/payment';
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

export const validateId = (
  id: string,
  errors: Errors<'invalidId' | 'emptyId'>
): FailedValidationResults => {
  if (typeof id !== 'string')
    return [errors.invalidId];

  if (id === '')
    return [errors.emptyId];
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

export const validatePaymentAsset = (
  asset: PaymentAsset | undefined,
  errors: Errors<
    | 'invalidAsset'
    | 'invalidAssetAddress' | 'assetAddressHasInvalidLength' | 'assetAddressIsNotContractAddress'
    | 'invalidAssetId' | 'assetIdIsNegative' | 'assetIdIsNotInteger'
    | 'invalidAssetDecimals' | 'assetDecimalsNumberIsNegative' | 'assetDecimalsNumberIsNotInteger'
  >
): FailedValidationResults => {
  if (asset === undefined)
    return;

  if (!guards.isPlainObject(asset))
    return [errors.invalidAsset];

  return validateAsset(asset, errors) || validateAssetDecimals(asset.decimals, errors);
};

export const validateDonationAsset = (
  asset: DonationAsset | undefined,
  errors: Errors<
    | 'invalidAsset'
    | 'invalidAssetAddress' | 'assetAddressHasInvalidLength' | 'assetAddressIsNotContractAddress'
    | 'invalidAssetId' | 'assetIdIsNegative' | 'assetIdIsNotInteger'
  >
): FailedValidationResults => {
  if (asset === undefined)
    return;

  if (!guards.isPlainObject(asset))
    return [errors.invalidAsset];

  return validateAsset(asset, errors);
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
  errors: Errors<'invalidData'>
): FailedValidationResults => {
  if (data === undefined)
    return;

  if (!guards.isPlainObject(data))
    return [errors.invalidData];
};

const validateAsset = (
  asset: PaymentAsset | DonationAsset,
  errors: Errors<
    | 'invalidAssetAddress' | 'assetAddressHasInvalidLength' | 'assetAddressIsNotContractAddress'
    | 'invalidAssetId' | 'assetIdIsNegative' | 'assetIdIsNotInteger'
  >
): FailedValidationResults => {
  return validateAssetAddress(asset.address, errors) || validateAssetId(asset.id, errors);
};

const validateAssetAddress = (
  assetAddress: string,
  errors: Errors<'invalidAssetAddress' | 'assetAddressHasInvalidLength' | 'assetAddressIsNotContractAddress'>
): FailedValidationResults => {
  if (typeof assetAddress !== 'string')
    return [errors.invalidAssetAddress];

  if (assetAddress.length !== tezosInfo.addressLength)
    return [errors.assetAddressHasInvalidLength];

  if (!tezosInfo.contractAddressPrefixes.some(prefix => assetAddress.startsWith(prefix)))
    return [errors.assetAddressIsNotContractAddress];
};

const validateAssetId = (
  assetId: number | null,
  errors: Errors<'invalidAssetId' | 'assetIdIsNegative' | 'assetIdIsNotInteger'>
): FailedValidationResults => {
  if (assetId === null)
    return;

  if (typeof assetId !== 'number' || Number.isNaN(assetId) || !Number.isFinite(assetId))
    return [errors.invalidAssetId];

  if (assetId < 0)
    return [errors.assetIdIsNegative];

  if (!Number.isInteger(assetId))
    return [errors.assetIdIsNotInteger];
};

const validateAssetDecimals = (
  assetDecimals: number,
  errors: Errors<'invalidAssetDecimals' | 'assetDecimalsNumberIsNegative' | 'assetDecimalsNumberIsNotInteger'>
): FailedValidationResults => {
  if (typeof assetDecimals !== 'number' || Number.isNaN(assetDecimals) || !Number.isFinite(assetDecimals))
    return [errors.invalidAssetDecimals];

  if (assetDecimals < 0)
    return [errors.assetDecimalsNumberIsNegative];

  if (!Number.isInteger(assetDecimals))
    return [errors.assetDecimalsNumberIsNotInteger];
};
