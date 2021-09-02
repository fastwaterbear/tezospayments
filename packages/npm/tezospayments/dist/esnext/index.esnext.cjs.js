'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common = require('@tezospayments/common');
var BigNumber = require('bignumber.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var BigNumber__default = /*#__PURE__*/_interopDefaultLegacy(BigNumber);

var constants = {
    defaultNetworkName: 'mainnet',
    paymentAppBaseUrl: 'https://payment.tezospayments.com'
};

const getErrorMessageByValidationErrors = (validationErrors, brief = '') => validationErrors
    .reduce((result, error, index) => `${result}\n\t${index + 1}. ${error};`, brief);
class TezosPaymentsError extends Error {
    name;
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
class InvalidTezosPaymentsOptionsError extends TezosPaymentsError {
    constructor(messageOrValidationErrors) {
        super(common.guards.isReadonlyArray(messageOrValidationErrors)
            ? InvalidTezosPaymentsOptionsError.getMessage(messageOrValidationErrors)
            : messageOrValidationErrors);
    }
    static getMessage(validationErrors) {
        return getErrorMessageByValidationErrors(validationErrors, 'options are invalid, see details below:');
    }
}
class InvalidPaymentCreateParametersError extends TezosPaymentsError {
}
class InvalidPaymentError extends TezosPaymentsError {
    constructor(messageOrValidationErrors) {
        super(common.guards.isReadonlyArray(messageOrValidationErrors)
            ? InvalidPaymentError.getMessage(messageOrValidationErrors)
            : messageOrValidationErrors);
    }
    static getMessage(validationErrors) {
        return getErrorMessageByValidationErrors(validationErrors, 'payment is invalid, see details below:');
    }
}
class UnsupportedPaymentUrlTypeError extends TezosPaymentsError {
}
class PaymentUrlError extends TezosPaymentsError {
}
class DonationUrlError extends TezosPaymentsError {
}

var errors = /*#__PURE__*/Object.freeze({
  __proto__: null,
  TezosPaymentsError: TezosPaymentsError,
  InvalidTezosPaymentsOptionsError: InvalidTezosPaymentsOptionsError,
  InvalidPaymentCreateParametersError: InvalidPaymentCreateParametersError,
  InvalidPaymentError: InvalidPaymentError,
  UnsupportedPaymentUrlTypeError: UnsupportedPaymentUrlTypeError,
  PaymentUrlError: PaymentUrlError,
  DonationUrlError: DonationUrlError
});

class PaymentUrlFactory {
    urlType;
    constructor(urlType) {
        this.urlType = urlType;
    }
}

class Base64PaymentUrlFactory extends PaymentUrlFactory {
    baseUrl;
    static baseUrl = constants.paymentAppBaseUrl;
    paymentSerializer = new common.PaymentSerializer();
    donationSerializer = new common.DonationSerializer();
    constructor(baseUrl = Base64PaymentUrlFactory.baseUrl) {
        super(common.PaymentUrlType.Base64);
        this.baseUrl = baseUrl;
    }
    createPaymentUrl(paymentOrDonation, network) {
        return paymentOrDonation.type === common.PaymentType.Payment
            ? this.createPaymentUrlInternal(paymentOrDonation, network)
            : this.createDonationUrlInternal(paymentOrDonation, network);
    }
    createPaymentUrlInternal(payment, network) {
        const serializedPaymentBase64 = this.paymentSerializer.serialize(payment);
        if (!serializedPaymentBase64)
            throw new PaymentUrlError('It\'s impossible to serialize the payment');
        try {
            return this.createUrl(true, payment.targetAddress, serializedPaymentBase64, network);
        }
        catch (error) {
            throw new PaymentUrlError('It\'s impossible to create an URL for the payment');
        }
    }
    createDonationUrlInternal(donation, network) {
        const serializedDonationBase64 = this.donationSerializer.serialize(donation);
        if (!serializedDonationBase64 && serializedDonationBase64 !== '')
            throw new DonationUrlError('It\'s impossible to serialize the donation');
        try {
            return this.createUrl(false, donation.targetAddress, serializedDonationBase64, network);
        }
        catch (error) {
            throw new DonationUrlError('It\'s impossible to create an URL for the donation');
        }
    }
    createUrl(isPayment, targetAddress, serializedPaymentOrDonationBase64, network) {
        const url = new common.native.URL(`${targetAddress}/${isPayment ? 'payment' : 'donation'}`, this.baseUrl);
        if (serializedPaymentOrDonationBase64 !== '')
            url.hash = common.getEncodedPaymentUrlType(this.urlType) + serializedPaymentOrDonationBase64;
        if (network.name !== constants.defaultNetworkName)
            url.searchParams.append('network', network.name);
        return url.href;
    }
}

var paymentUrlFactories = /*#__PURE__*/Object.freeze({
  __proto__: null,
  PaymentUrlFactory: PaymentUrlFactory,
  Base64PaymentUrlFactory: Base64PaymentUrlFactory
});

class TezosPaymentsSigner {
    signingType;
    constructor(signingType) {
        this.signingType = signingType;
    }
}

exports.SigningType = void 0;
(function (SigningType) {
    SigningType[SigningType["ApiSecretKey"] = 0] = "ApiSecretKey";
    SigningType[SigningType["Wallet"] = 1] = "Wallet";
    SigningType[SigningType["Custom"] = 2] = "Custom";
})(exports.SigningType || (exports.SigningType = {}));

class ApiSecretKeySigner extends TezosPaymentsSigner {
    apiSecretKey;
    constructor(apiSecretKey) {
        super(exports.SigningType.ApiSecretKey);
        this.apiSecretKey = apiSecretKey;
    }
    sign(_payment) {
        throw new Error('Method not implemented.');
    }
}

class WalletSigner extends TezosPaymentsSigner {
    walletSigning;
    constructor(walletSigning) {
        super(exports.SigningType.Wallet);
        this.walletSigning = walletSigning;
    }
    sign(_payment) {
        throw new Error('Method not implemented.');
    }
}

class CustomSigner extends TezosPaymentsSigner {
    customSigning;
    constructor(customSigning) {
        super(exports.SigningType.Custom);
        this.customSigning = customSigning;
    }
    sign(_payment) {
        throw new Error('Method not implemented.');
    }
}

var signers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  TezosPaymentsSigner: TezosPaymentsSigner,
  ApiSecretKeySigner: ApiSecretKeySigner,
  WalletSigner: WalletSigner,
  CustomSigner: CustomSigner
});

const tezosPaymentsOptionsValidationErrors = {
    // serviceContractAddress
    invalidServiceContractAddressType: 'Type of the serviceContractAddress option is invalid',
    serviceContractAddressHasInvalidLength: 'The serviceContractAddress option has an invalid address',
    serviceContractAddressIsNotContractAddress: 'The serviceContractAddress option isn\'t a contract address',
    // signing
    invalidSigningOption: 'The signing option is invalid',
    invalidApiSecretKeyType: 'The API secret key has an invalid type, it should be a string',
    emptyApiSecretKey: 'The API secret key is empty',
    invalidWalletSigningOptionType: 'The WalletSigning option has an invalid type, it should be a function',
    // defaultPaymentParameters
    invalidDefaultPaymentParameters: 'The default payment parameters are invalid',
    // defaultPaymentParameters.network
    emptyNetworkName: 'The network name is empty',
    invalidNetwork: 'The network is invalid',
    invalidNetworkName: 'The network name is invalid',
    invalidNetworkId: 'The network id is invalid',
    // defaultPaymentParameters.urlType
    invalidUrlType: 'The url type is invalid'
};

class TezosPayments {
    static defaultPaymentParameters = {
        network: common.networks.granadanet,
        urlType: common.PaymentUrlType.Base64
    };
    static optionsValidationErrors = tezosPaymentsOptionsValidationErrors;
    paymentValidator = new common.PaymentValidator();
    serviceContractAddress;
    signer;
    defaultPaymentParameters;
    paymentUrlFactories = new Map();
    constructor(options) {
        const errors = this.validateOptions(options);
        if (errors)
            throw new InvalidTezosPaymentsOptionsError(errors);
        this.serviceContractAddress = options.serviceContractAddress;
        this.defaultPaymentParameters = options.defaultPaymentParameters
            ? {
                network: options.defaultPaymentParameters.network || TezosPayments.defaultPaymentParameters.network,
                urlType: options.defaultPaymentParameters.urlType || TezosPayments.defaultPaymentParameters.urlType
            }
            : TezosPayments.defaultPaymentParameters;
        this.signer = this.createSigner(options.signing);
        this.getPaymentUrlFactory(this.defaultPaymentParameters.urlType);
    }
    async createPayment(createParameters) {
        if (!createParameters)
            throw new InvalidPaymentCreateParametersError(createParameters);
        let errors;
        if (createParameters.urlType || createParameters.network) {
            errors = this.validateDefaultPaymentParameters(createParameters);
            if (errors)
                throw new InvalidPaymentError(errors);
        }
        const paymentWithoutUrl = this.createPaymentByCreateParameters(createParameters);
        errors = this.paymentValidator.validate(paymentWithoutUrl, true);
        if (errors)
            throw new InvalidPaymentError(errors);
        const paymentUrl = await this.getPaymentUrl(paymentWithoutUrl, createParameters.urlType, createParameters.network);
        const payment = this.applyPaymentUrl(paymentWithoutUrl, paymentUrl);
        return payment;
    }
    getPaymentUrl(payment, urlType = this.defaultPaymentParameters.urlType, network = this.defaultPaymentParameters.network) {
        return this.getPaymentUrlFactory(urlType).createPaymentUrl(payment, network);
    }
    applyPaymentUrl(payment, url) {
        payment.url = url;
        return payment;
    }
    getPaymentUrlFactory(paymentUrlType) {
        let paymentUrlFactory = this.paymentUrlFactories.get(paymentUrlType);
        if (!paymentUrlFactory) {
            paymentUrlFactory = this.createPaymentUrlFactory(paymentUrlType);
            this.paymentUrlFactories.set(paymentUrlType, paymentUrlFactory);
        }
        return paymentUrlFactory;
    }
    createSigner(signingOptions) {
        if ('apiSecretKey' in signingOptions)
            return new ApiSecretKeySigner(signingOptions.apiSecretKey);
        if ('walletSigning' in signingOptions)
            return new WalletSigner(signingOptions.walletSigning);
        return new CustomSigner(signingOptions);
    }
    createPaymentUrlFactory(paymentUrlType) {
        switch (paymentUrlType) {
            case common.PaymentUrlType.Base64:
                return new Base64PaymentUrlFactory();
            default:
                throw new UnsupportedPaymentUrlTypeError(`This payment url type is not supported: ${paymentUrlType}`);
        }
    }
    createPaymentByCreateParameters(createParameters) {
        const payment = {
            type: common.PaymentType.Payment,
            targetAddress: this.serviceContractAddress,
            amount: new BigNumber__default['default'](createParameters.amount),
            data: createParameters.data,
            created: createParameters.created ? new Date(createParameters.created) : new Date(),
        };
        if (createParameters.asset)
            payment.asset = createParameters.asset;
        if (createParameters.expired)
            payment.expired = new Date(createParameters.expired);
        if (createParameters.successUrl)
            payment.successUrl = new common.native.URL(createParameters.successUrl);
        if (createParameters.cancelUrl)
            payment.cancelUrl = new common.native.URL(createParameters.cancelUrl);
        return payment;
    }
    validateOptions(options) {
        return [
            this.validateServiceContractAddress(options.serviceContractAddress),
            this.validateSigningOptions(options.signing),
            this.validateDefaultPaymentParameters(options.defaultPaymentParameters)
        ].reduce((result, currentErrors) => currentErrors ? (result || []).concat(currentErrors) : result, undefined);
    }
    validateServiceContractAddress(serviceContractAddress) {
        if (!serviceContractAddress || typeof serviceContractAddress !== 'string')
            return [TezosPayments.optionsValidationErrors.invalidServiceContractAddressType];
        if (serviceContractAddress.length !== common.tezosInfo.addressLength)
            return [TezosPayments.optionsValidationErrors.serviceContractAddressHasInvalidLength];
        if (!common.tezosInfo.contractAddressPrefixes.some(prefix => serviceContractAddress.startsWith(prefix)))
            return [TezosPayments.optionsValidationErrors.serviceContractAddressIsNotContractAddress];
    }
    validateSigningOptions(signingOptions) {
        if (typeof signingOptions !== 'object')
            return [TezosPayments.optionsValidationErrors.invalidSigningOption];
        if (typeof signingOptions === 'function')
            return;
        else if (!('apiSecretKey' in signingOptions) && !('walletSigning' in signingOptions))
            return [TezosPayments.optionsValidationErrors.invalidSigningOption];
        if ('apiSecretKey' in signingOptions) {
            if (typeof signingOptions.apiSecretKey !== 'string')
                return [TezosPayments.optionsValidationErrors.invalidApiSecretKeyType];
            if (!signingOptions.apiSecretKey)
                return [TezosPayments.optionsValidationErrors.emptyApiSecretKey];
        }
        if ('walletSigning' in signingOptions && typeof signingOptions.walletSigning !== 'function')
            return [TezosPayments.optionsValidationErrors.invalidWalletSigningOptionType];
    }
    validateDefaultPaymentParameters(defaultPaymentParameters) {
        if (defaultPaymentParameters === undefined)
            return;
        if (typeof defaultPaymentParameters !== 'object')
            return [TezosPayments.optionsValidationErrors.invalidDefaultPaymentParameters];
        if ('network' in defaultPaymentParameters) {
            if (typeof defaultPaymentParameters.network !== 'object')
                return [TezosPayments.optionsValidationErrors.invalidNetwork];
            if (defaultPaymentParameters.network.name === undefined || defaultPaymentParameters.network.name === '')
                return [TezosPayments.optionsValidationErrors.emptyNetworkName];
            if (typeof defaultPaymentParameters.network.name !== 'string' || !common.networkNameRegExp.test(defaultPaymentParameters.network.name))
                return [TezosPayments.optionsValidationErrors.invalidNetworkName];
            if (defaultPaymentParameters.network.id && (typeof defaultPaymentParameters.network.id !== 'string' || !common.networkIdRegExp.test(defaultPaymentParameters.network.id)))
                return [TezosPayments.optionsValidationErrors.invalidNetworkId];
        }
        if ('urlType' in defaultPaymentParameters && defaultPaymentParameters.urlType !== common.PaymentUrlType.Base64)
            return [TezosPayments.optionsValidationErrors.invalidUrlType];
    }
}

const internal = {
    constants,
    errors,
    paymentUrlFactories,
    signers
};

Object.defineProperty(exports, 'PaymentUrlType', {
  enumerable: true,
  get: function () {
    return common.PaymentUrlType;
  }
});
exports.TezosPayments = TezosPayments;
exports.internal = internal;
//# sourceMappingURL=index.esnext.cjs.js.map
