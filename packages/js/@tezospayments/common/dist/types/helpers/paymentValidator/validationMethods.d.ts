import BigNumber from 'bignumber.js';
import { DonationAsset, Payment, PaymentAsset } from '../../models/payment';
import type { FailedValidationResults } from '../../models/validation';
import { URL } from '../../native';
declare type Errors<FieldNames extends string> = {
    readonly [P in FieldNames]: string;
};
export declare const validateTargetAddress: (targetAddress: string, errors: Errors<'invalidTargetAddress' | 'targetAddressHasInvalidLength' | 'targetAddressIsNotNetworkAddress'>) => FailedValidationResults;
export declare const validateId: (id: string, errors: Errors<'invalidId' | 'emptyId'>) => FailedValidationResults;
export declare const validateAmount: (amount: BigNumber, errors: Errors<'invalidAmount' | 'amountIsNonPositive'>) => FailedValidationResults;
export declare const validateDesiredAmount: (desiredAmount: BigNumber | undefined, errors: Errors<'invalidAmount' | 'amountIsNonPositive'>) => FailedValidationResults;
export declare const validatePaymentAsset: (asset: PaymentAsset | undefined, errors: Errors<'invalidAsset' | 'invalidAssetAddress' | 'assetAddressHasInvalidLength' | 'assetAddressIsNotContractAddress' | 'invalidAssetId' | 'assetIdIsNegative' | 'assetIdIsNotInteger' | 'invalidAssetDecimals' | 'assetDecimalsNumberIsNegative' | 'assetDecimalsNumberIsNotInteger'>) => FailedValidationResults;
export declare const validateDonationAsset: (asset: DonationAsset | undefined, errors: Errors<'invalidAsset' | 'invalidAssetAddress' | 'assetAddressHasInvalidLength' | 'assetAddressIsNotContractAddress' | 'invalidAssetId' | 'assetIdIsNegative' | 'assetIdIsNotInteger'>) => FailedValidationResults;
export declare const validateCreatedDate: (date: Date, errors: Errors<'invalidCreatedDate'>) => FailedValidationResults;
export declare const validateUrl: (url: URL | undefined, errors: Errors<'invalidUrl' | 'invalidProtocol'>) => FailedValidationResults;
export declare const validateExpiredDate: (expiredDate: Date | undefined, createdDate: Date, minimumPaymentLifetime: number, errors: Errors<'invalidExpiredDate' | 'paymentLifetimeIsShort'>) => FailedValidationResults;
export declare const validateData: (data: Payment['data'], errors: Errors<'invalidData'>) => FailedValidationResults;
export {};
