import type { Payment, UnsignedPayment } from '../../models/payment';
import type { PaymentValidationMethod } from './paymentValidationMethod';
import { PaymentValidatorBase } from './paymentValidatorBase';
export declare class PaymentValidator extends PaymentValidatorBase<Payment | UnsignedPayment> {
    static readonly errors: {
        readonly invalidPaymentObject: "Payment is undefined or not object";
        readonly invalidType: "Payment type is invalid";
        readonly invalidTargetAddress: "Target address is invalid";
        readonly targetAddressIsNotNetworkAddress: "Target address isn't a network address";
        readonly targetAddressHasInvalidLength: "Target address has an invalid address";
        readonly invalidId: "Id is invalid";
        readonly emptyId: "Id is empty";
        readonly invalidAmount: "Amount is invalid";
        readonly amountIsNonPositive: "Amount is less than or equal to zero";
        readonly invalidData: "Payment data is invalid";
        readonly invalidAsset: "Asset is invalid";
        readonly invalidAssetAddress: "Asset address is invalid";
        readonly assetAddressIsNotContractAddress: "Asset address isn't a contract address";
        readonly assetAddressHasInvalidLength: "Asset address has an invalid address";
        readonly invalidAssetId: "Asset Id is invalid";
        readonly assetIdIsNegative: "Asset Id is negative";
        readonly assetIdIsNotInteger: "Asset Id isn't an integer";
        readonly invalidAssetDecimals: "Asset number of decimals is invalid";
        readonly assetDecimalsNumberIsNegative: "Asset number of decimals is negative";
        readonly assetDecimalsNumberIsNotInteger: "Asset number of decimals isn't an integer";
        readonly invalidSuccessUrl: "Success URL is invalid";
        readonly successUrlHasInvalidProtocol: "Success URL has an invalid protocol";
        readonly invalidCancelUrl: "Cancel URL is invalid";
        readonly cancelUrlHasInvalidProtocol: "Cancel URL has an invalid protocol";
        readonly invalidCreatedDate: "Created date is invalid";
        readonly invalidExpiredDate: "Expired date is invalid";
        readonly paymentLifetimeIsShort: "Payment lifetime is short";
    };
    static readonly minimumPaymentLifetime = 600000;
    protected readonly validationMethods: ReadonlyArray<PaymentValidationMethod<Payment | UnsignedPayment>>;
    protected readonly invalidPaymentObjectError: "Payment is undefined or not object";
    private static readonly successUrlErrors;
    private static readonly cancelUrlErrors;
}
