import type { Payment } from '../../models/payment';
import type { PaymentValidationMethod } from './paymentValidationMethod';
import { PaymentValidatorBase } from './paymentValidatorBase';
export declare class PaymentValidator extends PaymentValidatorBase<Payment> {
    static readonly errors: {
        readonly invalidPaymentObject: "Payment is undefined or not object";
        readonly invalidType: "Payment type is invalid";
        readonly invalidAmount: "Amount is invalid";
        readonly amountIsNonPositive: "Amount is less than or equal to zero";
        readonly invalidTargetAddress: "Target address is invalid";
        readonly targetAddressIsNotNetworkAddress: "Target address isn't a network address";
        readonly targetAddressHasInvalidLength: "Target address has an invalid address";
        readonly invalidData: "Payment data is invalid";
        readonly invalidPublicData: "Payment public data is invalid";
        readonly invalidPrivateData: "Payment private data is invalid";
        readonly publicDataShouldBeFlat: "Public data should be flat";
        readonly privateDataShouldBeFlat: "Private data should be flat";
        readonly invalidAsset: "Asset address is invalid";
        readonly assetIsNotContractAddress: "Asset address isn't a contract address";
        readonly assetHasInvalidLength: "Asset address has an invalid address";
        readonly invalidSuccessUrl: "Success URL is invalid";
        readonly successUrlHasInvalidProtocol: "Success URL has an invalid protocol";
        readonly invalidCancelUrl: "Cancel URL is invalid";
        readonly cancelUrlHasInvalidProtocol: "Cancel URL has an invalid protocol";
        readonly invalidCreatedDate: "Created date is invalid";
        readonly invalidExpiredDate: "Expired date is invalid";
        readonly paymentLifetimeIsShort: "Payment lifetime is short";
    };
    static readonly minimumPaymentLifetime = 600000;
    protected readonly validationMethods: ReadonlyArray<PaymentValidationMethod<Payment>>;
    protected readonly invalidPaymentObjectError: "Payment is undefined or not object";
    private static readonly successUrlErrors;
    private static readonly cancelUrlErrors;
}
