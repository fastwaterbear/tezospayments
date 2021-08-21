import { BigNumber } from 'bignumber.js';
import { Payment } from '../../models/payment';
import type { FailedValidationResults } from '../../models/validation';
import { URL } from '../../native';
declare type Errors<FieldNames extends string> = {
    readonly [P in FieldNames]: string;
};
export declare const validateTargetAddress: (targetAddress: string, errors: Errors<'invalidTargetAddress' | 'targetAddressHasInvalidLength' | 'targetAddressIsNotNetworkAddress'>) => FailedValidationResults;
export declare const validateAmount: (amount: BigNumber, errors: Errors<'invalidAmount' | 'amountIsNegative'>) => FailedValidationResults;
export declare const validateDesiredAmount: (desiredAmount: BigNumber | undefined, errors: Errors<'invalidAmount' | 'amountIsNegative'>) => FailedValidationResults;
export declare const validateAsset: (asset: string | undefined, errors: Errors<'invalidAsset' | 'assetHasInvalidLength' | 'assetIsNotContractAddress'>) => FailedValidationResults;
export declare const validateCreatedDate: (date: Date, errors: Errors<'invalidCreatedDate'>) => FailedValidationResults;
export declare const validateUrl: (url: URL | undefined, errors: Errors<'invalidUrl' | 'invalidProtocol'>) => FailedValidationResults;
export declare const validateExpiredDate: (expiredDate: Date | undefined, createdDate: Date, minimumPaymentLifetime: number, errors: Errors<'invalidExpiredDate' | 'paymentLifetimeIsShort'>) => FailedValidationResults;
export declare const validateData: (data: Payment['data'], errors: Errors<'invalidData' | 'invalidPublicData' | 'publicDataShouldBeFlat' | 'invalidPrivateData' | 'privateDataShouldBeFlat'>) => FailedValidationResults;
export {};
