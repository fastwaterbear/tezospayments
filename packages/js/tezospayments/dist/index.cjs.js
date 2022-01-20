'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common = require('@tezospayments/common');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var signer = require('@taquito/signer');
var BigNumber = require('bignumber.js');
var nanoid = require('nanoid');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var BigNumber__default = /*#__PURE__*/_interopDefaultLegacy(BigNumber);

var constants = {
  defaultNetworkName: 'mainnet',
  paymentAppBaseUrl: 'https://payment.tezospayments.com'
};

const getErrorMessageByValidationErrors = function (validationErrors) {
  let brief = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return validationErrors.reduce((result, error, index) => "".concat(result, "\n\t").concat(index + 1, ". ").concat(error, ";"), brief);
};

class TezosPaymentsError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }

}
class InvalidTezosPaymentsOptionsError extends TezosPaymentsError {
  constructor(messageOrValidationErrors) {
    super(common.guards.isReadonlyArray(messageOrValidationErrors) ? InvalidTezosPaymentsOptionsError.getMessage(messageOrValidationErrors) : messageOrValidationErrors);
  }

  static getMessage(validationErrors) {
    return getErrorMessageByValidationErrors(validationErrors, 'options are invalid, see details below:');
  }

}
class InvalidPaymentCreateParametersError extends TezosPaymentsError {}
class InvalidPaymentError extends TezosPaymentsError {
  constructor(messageOrValidationErrors) {
    super(common.guards.isReadonlyArray(messageOrValidationErrors) ? InvalidPaymentError.getMessage(messageOrValidationErrors) : messageOrValidationErrors);
  }

  static getMessage(validationErrors) {
    return getErrorMessageByValidationErrors(validationErrors, 'payment is invalid, see details below:');
  }

}
class UnsupportedPaymentUrlTypeError extends TezosPaymentsError {}
class PaymentUrlError extends TezosPaymentsError {}
class DonationUrlError extends TezosPaymentsError {}

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
  constructor(urlType) {
    this.urlType = urlType;
  }

}

class Base64PaymentUrlFactory extends PaymentUrlFactory {
  constructor() {
    let baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Base64PaymentUrlFactory.baseUrl;
    super(common.PaymentUrlType.Base64);

    _defineProperty__default["default"](this, "paymentSerializer", new common.PaymentSerializer());

    _defineProperty__default["default"](this, "donationSerializer", new common.DonationSerializer());

    this.baseUrl = baseUrl;
  }

  createPaymentUrl(paymentOrDonation, network) {
    return paymentOrDonation.type === common.PaymentType.Payment ? this.createPaymentUrlInternal(paymentOrDonation, network) : this.createDonationUrlInternal(paymentOrDonation, network);
  }

  createPaymentUrlInternal(payment, network) {
    const serializedPaymentBase64 = this.paymentSerializer.serialize(payment);
    if (!serializedPaymentBase64) throw new PaymentUrlError('It\'s impossible to serialize the payment');

    try {
      const url = new common.native.URL(this.baseUrl);
      return this.createUrl(url, serializedPaymentBase64, network);
    } catch (error) {
      throw new PaymentUrlError('It\'s impossible to create an URL for the payment');
    }
  }

  createDonationUrlInternal(donation, network) {
    const serializedDonationBase64 = this.donationSerializer.serialize(donation);
    if (!serializedDonationBase64 && serializedDonationBase64 !== '') throw new DonationUrlError('It\'s impossible to serialize the donation');

    try {
      const url = new common.native.URL("".concat(donation.targetAddress, "/donation"), this.baseUrl);
      return this.createUrl(url, serializedDonationBase64, network);
    } catch (error) {
      throw new DonationUrlError('It\'s impossible to create an URL for the donation');
    }
  }

  createUrl(baseUrl, serializedPaymentOrDonationBase64, network) {
    if (serializedPaymentOrDonationBase64 !== '') baseUrl.hash = common.getEncodedPaymentUrlType(this.urlType) + serializedPaymentOrDonationBase64;
    if (network.name !== constants.defaultNetworkName) baseUrl.searchParams.append('network', network.name);
    return baseUrl.href;
  }

}

_defineProperty__default["default"](Base64PaymentUrlFactory, "baseUrl", constants.paymentAppBaseUrl);

var paymentUrlFactories = /*#__PURE__*/Object.freeze({
  __proto__: null,
  PaymentUrlFactory: PaymentUrlFactory,
  Base64PaymentUrlFactory: Base64PaymentUrlFactory
});

class TezosPaymentsSigner {
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
  constructor(apiSecretKey) {
    super(exports.SigningType.ApiSecretKey);

    _defineProperty__default["default"](this, "paymentSignPayloadEncoder", new common.PaymentSignPayloadEncoder());

    this.apiSecretKey = apiSecretKey;
    this.inMemorySigner = new signer.InMemorySigner(this.apiSecretKey);
  }

  async sign(payment) {
    var _signatures$;

    const signPayload = this.paymentSignPayloadEncoder.encode(payment);
    const contractSigningPromise = this.inMemorySigner.sign(signPayload.contractSignPayload);
    const signingPromises = signPayload.clientSignPayload ? [contractSigningPromise, this.inMemorySigner.sign(signPayload.clientSignPayload)] : [contractSigningPromise];
    const signatures = await Promise.all(signingPromises);
    return {
      signingPublicKey: await this.inMemorySigner.publicKey(),
      contract: signatures[0].prefixSig,
      client: (_signatures$ = signatures[1]) === null || _signatures$ === void 0 ? void 0 : _signatures$.prefixSig
    };
  }

}

class WalletSigner extends TezosPaymentsSigner {
  constructor(signingPublicKey, walletSignCallback) {
    super(exports.SigningType.Wallet);

    _defineProperty__default["default"](this, "paymentSignPayloadEncoder", new common.PaymentSignPayloadEncoder());

    this.signingPublicKey = signingPublicKey;
    this.walletSignCallback = walletSignCallback;
  }

  async sign(payment) {
    const signPayload = this.paymentSignPayloadEncoder.encode(payment);
    const walletContractSignPayload = signPayload.contractSignPayload.substring(2);
    const contractSigningPromise = this.walletSignCallback(walletContractSignPayload);
    const signingPromises = signPayload.clientSignPayload ? [contractSigningPromise, this.walletSignCallback(signPayload.clientSignPayload)] : [contractSigningPromise];
    const signatures = await Promise.all(signingPromises);
    return {
      signingPublicKey: this.signingPublicKey,
      contract: signatures[0],
      client: signatures[1]
    };
  }

}

class CustomSigner extends TezosPaymentsSigner {
  constructor(customSigning) {
    super(exports.SigningType.Custom);
    this.customSigning = customSigning;
  }

  sign(payment) {
    return this.customSigning(payment);
  }

}

var signers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  TezosPaymentsSigner: TezosPaymentsSigner,
  ApiSecretKeySigner: ApiSecretKeySigner,
  WalletSigner: WalletSigner,
  CustomSigner: CustomSigner
});

class TezosPaymentsOptionsValidator {
  validateOptions(options) {
    return [this.validateServiceContractAddress(options.serviceContractAddress), this.validateNetwork(options.network), this.validateSigningOptions(options.signing), this.validateDefaultPaymentParameters(options.defaultPaymentParameters)].reduce((result, currentErrors) => currentErrors ? (result || []).concat(currentErrors) : result, undefined);
  }

  validateServiceContractAddress(serviceContractAddress) {
    if (!serviceContractAddress || typeof serviceContractAddress !== 'string') return [TezosPaymentsOptionsValidator.errors.invalidServiceContractAddressType];
    if (serviceContractAddress.length !== common.tezosInfo.addressLength) return [TezosPaymentsOptionsValidator.errors.serviceContractAddressHasInvalidLength];
    if (!common.tezosInfo.contractAddressPrefixes.some(prefix => serviceContractAddress.startsWith(prefix))) return [TezosPaymentsOptionsValidator.errors.serviceContractAddressIsNotContractAddress];
  }

  validateNetwork(network) {
    if (network === undefined || network === null) return;
    if (typeof network !== 'object') return [TezosPaymentsOptionsValidator.errors.invalidNetwork];
    if (network.name === undefined || network.name === '') return [TezosPaymentsOptionsValidator.errors.emptyNetworkName];
    if (typeof network.name !== 'string' || !common.networkNameRegExp.test(network.name)) return [TezosPaymentsOptionsValidator.errors.invalidNetworkName];
    if (network.id && (typeof network.id !== 'string' || !common.networkIdRegExp.test(network.id))) return [TezosPaymentsOptionsValidator.errors.invalidNetworkId];
  }

  validateSigningOptions(signingOptions) {
    if (typeof signingOptions !== 'object') return [TezosPaymentsOptionsValidator.errors.invalidSigningOption];
    if (!('apiSecretKey' in signingOptions) && !('wallet' in signingOptions) && !('custom' in signingOptions)) return [TezosPaymentsOptionsValidator.errors.invalidSigningOption];
    if ('apiSecretKey' in signingOptions) return this.validateApiSecretKeySigningOptions(signingOptions);
    if ('wallet' in signingOptions) return this.validateWalletSigningOptions(signingOptions);
    if ('custom' in signingOptions) return this.validateCustomSigningOptions(signingOptions);
  }

  validateApiSecretKeySigningOptions(signingOptions) {
    if (typeof signingOptions.apiSecretKey !== 'string') return [TezosPaymentsOptionsValidator.errors.invalidApiSecretKeyType];
    if (!signingOptions.apiSecretKey) return [TezosPaymentsOptionsValidator.errors.emptyApiSecretKey];
  }

  validateWalletSigningOptions(signingOptions) {
    if (typeof signingOptions.wallet !== 'object') return [TezosPaymentsOptionsValidator.errors.invalidWalletSigningOption];
    if (typeof signingOptions.wallet.signingPublicKey !== 'string') return [TezosPaymentsOptionsValidator.errors.invalidWalletSigningPublicKey];
    if (!signingOptions.wallet.signingPublicKey) return [TezosPaymentsOptionsValidator.errors.emptyWalletSigningPublicKey];
    if (typeof signingOptions.wallet.sign !== 'function') return [TezosPaymentsOptionsValidator.errors.invalidWalletSignFunctionType];
  }

  validateCustomSigningOptions(signingOptions) {
    if (typeof signingOptions.custom !== 'function') return [TezosPaymentsOptionsValidator.errors.invalidCustomSigningOption];
  }

  validateDefaultPaymentParameters(defaultPaymentParameters) {
    if (defaultPaymentParameters === undefined) return;
    if (typeof defaultPaymentParameters !== 'object') return [TezosPaymentsOptionsValidator.errors.invalidDefaultPaymentParameters];
    if ('urlType' in defaultPaymentParameters && defaultPaymentParameters.urlType !== common.PaymentUrlType.Base64) return [TezosPaymentsOptionsValidator.errors.invalidUrlType];
  }

}

_defineProperty__default["default"](TezosPaymentsOptionsValidator, "errors", {
  // serviceContractAddress
  invalidServiceContractAddressType: 'Type of the serviceContractAddress option is invalid',
  serviceContractAddressHasInvalidLength: 'The serviceContractAddress option has an invalid address',
  serviceContractAddressIsNotContractAddress: 'The serviceContractAddress option isn\'t a contract address',
  // signing
  invalidSigningOption: 'The signing option is invalid',
  // signing.apiSecretKey
  invalidApiSecretKeyType: 'The API secret key has an invalid type, it should be a string',
  emptyApiSecretKey: 'The API secret key is empty',
  // signing.wallet
  invalidWalletSigningOption: 'The "signing.wallet" option is invalid',
  invalidWalletSigningPublicKey: 'The wallet signing public key has an invalid type, it should be a string',
  emptyWalletSigningPublicKey: 'The wallet signing public key is empty',
  invalidWalletSignFunctionType: 'The wallet sign function has an invalid type, it should be a function',
  // signing.custom
  invalidCustomSigningOption: 'The "signing.custom" option has an invalid type, it should be a function',
  // network
  emptyNetworkName: 'The network name is empty',
  invalidNetwork: 'The network is invalid',
  invalidNetworkName: 'The network name is invalid',
  invalidNetworkId: 'The network id is invalid',
  // defaultPaymentParameters
  invalidDefaultPaymentParameters: 'The default payment parameters are invalid',
  // defaultPaymentParameters.urlType
  invalidUrlType: 'The url type is invalid'
});

class TezosPayments {
  constructor(options) {
    _defineProperty__default["default"](this, "optionsValidator", new TezosPaymentsOptionsValidator());

    _defineProperty__default["default"](this, "paymentValidator", new common.PaymentValidator());

    _defineProperty__default["default"](this, "paymentUrlFactories", new Map());

    const errors = this.optionsValidator.validateOptions(options);
    if (errors) throw new InvalidTezosPaymentsOptionsError(errors);
    this.serviceContractAddress = options.serviceContractAddress;
    this.network = options.network || common.networks.mainnet;
    this.defaultPaymentParameters = options.defaultPaymentParameters ? {
      urlType: options.defaultPaymentParameters.urlType || TezosPayments.defaultPaymentParameters.urlType
    } : TezosPayments.defaultPaymentParameters;
    this.signer = this.createSigner(options.signing);
    this.getPaymentUrlFactory(this.defaultPaymentParameters.urlType);
  }

  async createPayment(createParameters) {
    if (!createParameters) throw new InvalidPaymentCreateParametersError(createParameters);
    let errors;

    if (createParameters.urlType) {
      errors = this.optionsValidator.validateDefaultPaymentParameters(createParameters);
      if (errors) throw new InvalidPaymentError(errors);
    }

    const unsignedPayment = this.createPaymentByCreateParameters(createParameters);
    errors = this.paymentValidator.validate(unsignedPayment, true);
    if (errors) throw new InvalidPaymentError(errors);
    const signedPayment = await this.getSignedPayment(unsignedPayment);
    errors = this.paymentValidator.validate(signedPayment, true);
    if (errors) throw new InvalidPaymentError(errors);
    const paymentUrl = await this.getPaymentUrl(signedPayment, createParameters.urlType);
    const payment = this.applyPaymentUrl(signedPayment, paymentUrl);
    return payment;
  }

  getPaymentUrl(payment) {
    let urlType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaultPaymentParameters.urlType;
    return this.getPaymentUrlFactory(urlType).createPaymentUrl(payment, this.network);
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

  async getSignedPayment(unsignedPayment) {
    unsignedPayment.signature = await this.signer.sign(unsignedPayment);
    return unsignedPayment;
  }

  createSigner(signingOptions) {
    if ('apiSecretKey' in signingOptions) return new ApiSecretKeySigner(signingOptions.apiSecretKey);
    if ('wallet' in signingOptions) return new WalletSigner(signingOptions.wallet.signingPublicKey, signingOptions.wallet.sign);
    return new CustomSigner(signingOptions.custom);
  }

  createPaymentUrlFactory(paymentUrlType) {
    switch (paymentUrlType) {
      case common.PaymentUrlType.Base64:
        return new Base64PaymentUrlFactory();

      default:
        throw new UnsupportedPaymentUrlTypeError("This payment url type is not supported: ".concat(paymentUrlType));
    }
  }

  createPaymentByCreateParameters(createParameters) {
    // TODO: check decimals
    // TODO: floor amount to decimals count: new BigNumber(amount).toFixed(asset.decimals)
    const payment = {
      type: common.PaymentType.Payment,
      id: createParameters.id || nanoid.nanoid(),
      targetAddress: this.serviceContractAddress,
      amount: new BigNumber__default["default"](createParameters.amount),
      data: createParameters.data,
      created: createParameters.created ? new Date(createParameters.created) : new Date()
    };
    if (createParameters.asset) payment.asset = createParameters.asset;
    if (createParameters.expired) payment.expired = new Date(createParameters.expired);
    if (createParameters.successUrl) payment.successUrl = new common.native.URL(createParameters.successUrl);
    if (createParameters.cancelUrl) payment.cancelUrl = new common.native.URL(createParameters.cancelUrl);
    return payment;
  }

}

_defineProperty__default["default"](TezosPayments, "defaultPaymentParameters", {
  urlType: common.PaymentUrlType.Base64
});

const internal = {
  constants,
  errors,
  paymentUrlFactories,
  signers
};

Object.defineProperty(exports, 'PaymentUrlType', {
  enumerable: true,
  get: function () { return common.PaymentUrlType; }
});
exports.TezosPayments = TezosPayments;
exports.internal = internal;
//# sourceMappingURL=index.cjs.js.map
