import { guards, PaymentUrlType, PaymentSerializer, DonationSerializer, PaymentType, native, getEncodedPaymentUrlType, PaymentSignPayloadEncoder, networks, PaymentValidator, tezosInfo, networkNameRegExp, networkIdRegExp } from '@tezospayments/common';
export { PaymentUrlType } from '@tezospayments/common';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import { InMemorySigner } from '@taquito/signer';
import BigNumber from 'bignumber.js';
import { nanoid } from 'nanoid';

var constants = {
  defaultNetworkName: 'mainnet',
  paymentAppBaseUrl: 'https://payment.tezospayments.com'
};

const getErrorMessageByValidationErrors = (validationErrors, brief = '') => validationErrors.reduce((result, error, index) => `${result}\n\t${index + 1}. ${error};`, brief);

class TezosPaymentsError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }

}
class InvalidTezosPaymentsOptionsError extends TezosPaymentsError {
  constructor(messageOrValidationErrors) {
    super(guards.isReadonlyArray(messageOrValidationErrors) ? InvalidTezosPaymentsOptionsError.getMessage(messageOrValidationErrors) : messageOrValidationErrors);
  }

  static getMessage(validationErrors) {
    return getErrorMessageByValidationErrors(validationErrors, 'options are invalid, see details below:');
  }

}
class InvalidPaymentCreateParametersError extends TezosPaymentsError {}
class InvalidPaymentError extends TezosPaymentsError {
  constructor(messageOrValidationErrors) {
    super(guards.isReadonlyArray(messageOrValidationErrors) ? InvalidPaymentError.getMessage(messageOrValidationErrors) : messageOrValidationErrors);
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
  constructor(baseUrl = Base64PaymentUrlFactory.baseUrl) {
    super(PaymentUrlType.Base64);

    _defineProperty(this, "paymentSerializer", new PaymentSerializer());

    _defineProperty(this, "donationSerializer", new DonationSerializer());

    this.baseUrl = baseUrl;
  }

  createPaymentUrl(paymentOrDonation, network) {
    return paymentOrDonation.type === PaymentType.Payment ? this.createPaymentUrlInternal(paymentOrDonation, network) : this.createDonationUrlInternal(paymentOrDonation, network);
  }

  createPaymentUrlInternal(payment, network) {
    const serializedPaymentBase64 = this.paymentSerializer.serialize(payment);
    if (!serializedPaymentBase64) throw new PaymentUrlError('It\'s impossible to serialize the payment');

    try {
      return this.createUrl(true, payment.targetAddress, serializedPaymentBase64, network);
    } catch (error) {
      throw new PaymentUrlError('It\'s impossible to create an URL for the payment');
    }
  }

  createDonationUrlInternal(donation, network) {
    const serializedDonationBase64 = this.donationSerializer.serialize(donation);
    if (!serializedDonationBase64 && serializedDonationBase64 !== '') throw new DonationUrlError('It\'s impossible to serialize the donation');

    try {
      return this.createUrl(false, donation.targetAddress, serializedDonationBase64, network);
    } catch (error) {
      throw new DonationUrlError('It\'s impossible to create an URL for the donation');
    }
  }

  createUrl(isPayment, targetAddress, serializedPaymentOrDonationBase64, network) {
    const url = new native.URL(`${targetAddress}/${isPayment ? 'payment' : 'donation'}`, this.baseUrl);
    if (serializedPaymentOrDonationBase64 !== '') url.hash = getEncodedPaymentUrlType(this.urlType) + serializedPaymentOrDonationBase64;
    if (network.name !== constants.defaultNetworkName) url.searchParams.append('network', network.name);
    return url.href;
  }

}

_defineProperty(Base64PaymentUrlFactory, "baseUrl", constants.paymentAppBaseUrl);

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

var SigningType;

(function (SigningType) {
  SigningType[SigningType["ApiSecretKey"] = 0] = "ApiSecretKey";
  SigningType[SigningType["Wallet"] = 1] = "Wallet";
  SigningType[SigningType["Custom"] = 2] = "Custom";
})(SigningType || (SigningType = {}));

class ApiSecretKeySigner extends TezosPaymentsSigner {
  constructor(apiSecretKey) {
    super(SigningType.ApiSecretKey);

    _defineProperty(this, "paymentSignPayloadEncoder", new PaymentSignPayloadEncoder());

    this.apiSecretKey = apiSecretKey;
    this.inMemorySigner = new InMemorySigner(this.apiSecretKey);
  }

  async sign(payment) {
    var _signatures$;

    const signPayload = this.paymentSignPayloadEncoder.encode(payment);
    const contractSigningPromise = this.inMemorySigner.sign(signPayload.contractSignPayload);
    const signingPromises = signPayload.clientSignPayload ? [contractSigningPromise, this.inMemorySigner.sign(signPayload.clientSignPayload)] : [contractSigningPromise]; // TODO: add "[Awaited<ReturnType<typeof this.inMemorySigner.sign>>, Awaited<ReturnType<typeof this.inMemorySigner.sign>>?]" type

    const signatures = await Promise.all(signingPromises);
    return {
      signingPublicKey: await this.inMemorySigner.publicKey(),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      contract: signatures[0].prefixSig,
      client: (_signatures$ = signatures[1]) === null || _signatures$ === void 0 ? void 0 : _signatures$.prefixSig
    };
  }

}

class WalletSigner extends TezosPaymentsSigner {
  constructor(walletSigning) {
    super(SigningType.Wallet);

    _defineProperty(this, "paymentSignPayloadEncoder", new PaymentSignPayloadEncoder());

    this.walletSigning = walletSigning;
  }

  async sign(payment) {
    const signPayload = this.paymentSignPayloadEncoder.encode(payment);
    const walletContractSignPayload = signPayload.contractSignPayload.substring(2);
    const contractSigningPromise = this.walletSigning(walletContractSignPayload);
    const signingPromises = signPayload.clientSignPayload ? [contractSigningPromise, this.walletSigning(signPayload.clientSignPayload)] : [contractSigningPromise]; // TODO: add "[Awaited<ReturnType<typeof this.inMemorySigner.sign>>, Awaited<ReturnType<typeof this.inMemorySigner.sign>>?]" type

    const signatures = await Promise.all(signingPromises);
    return {
      signingPublicKey: '',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      contract: signatures[0],
      client: signatures[1]
    };
  }

}

class CustomSigner extends TezosPaymentsSigner {
  constructor(customSigning) {
    super(SigningType.Custom);
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
  constructor(options) {
    _defineProperty(this, "paymentValidator", new PaymentValidator());

    _defineProperty(this, "paymentUrlFactories", new Map());

    const errors = this.validateOptions(options);
    if (errors) throw new InvalidTezosPaymentsOptionsError(errors);
    this.serviceContractAddress = options.serviceContractAddress;
    this.defaultPaymentParameters = options.defaultPaymentParameters ? {
      network: options.defaultPaymentParameters.network || TezosPayments.defaultPaymentParameters.network,
      urlType: options.defaultPaymentParameters.urlType || TezosPayments.defaultPaymentParameters.urlType
    } : TezosPayments.defaultPaymentParameters;
    this.signer = this.createSigner(options.signing);
    this.getPaymentUrlFactory(this.defaultPaymentParameters.urlType);
  }

  async createPayment(createParameters) {
    if (!createParameters) throw new InvalidPaymentCreateParametersError(createParameters);
    let errors;

    if (createParameters.urlType) {
      errors = this.validateDefaultPaymentParameters(createParameters);
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

  getPaymentUrl(payment, urlType = this.defaultPaymentParameters.urlType) {
    return this.getPaymentUrlFactory(urlType).createPaymentUrl(payment, this.defaultPaymentParameters.network);
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
    if ('walletSigning' in signingOptions) return new WalletSigner(signingOptions.walletSigning);
    return new CustomSigner(signingOptions);
  }

  createPaymentUrlFactory(paymentUrlType) {
    switch (paymentUrlType) {
      case PaymentUrlType.Base64:
        return new Base64PaymentUrlFactory();

      default:
        throw new UnsupportedPaymentUrlTypeError(`This payment url type is not supported: ${paymentUrlType}`);
    }
  }

  createPaymentByCreateParameters(createParameters) {
    // TODO: check decimals
    // TODO: floor amount to decimals count: new BigNumber(amount).toFixed(asset.decimals)
    const payment = {
      type: PaymentType.Payment,
      id: createParameters.id || nanoid(),
      targetAddress: this.serviceContractAddress,
      amount: new BigNumber(createParameters.amount),
      data: createParameters.data,
      created: createParameters.created ? new Date(createParameters.created) : new Date()
    };
    if (createParameters.asset) payment.asset = createParameters.asset;
    if (createParameters.expired) payment.expired = new Date(createParameters.expired);
    if (createParameters.successUrl) payment.successUrl = new native.URL(createParameters.successUrl);
    if (createParameters.cancelUrl) payment.cancelUrl = new native.URL(createParameters.cancelUrl);
    return payment;
  }

  validateOptions(options) {
    return [this.validateServiceContractAddress(options.serviceContractAddress), this.validateSigningOptions(options.signing), this.validateDefaultPaymentParameters(options.defaultPaymentParameters)].reduce((result, currentErrors) => currentErrors ? (result || []).concat(currentErrors) : result, undefined);
  }

  validateServiceContractAddress(serviceContractAddress) {
    if (!serviceContractAddress || typeof serviceContractAddress !== 'string') return [TezosPayments.optionsValidationErrors.invalidServiceContractAddressType];
    if (serviceContractAddress.length !== tezosInfo.addressLength) return [TezosPayments.optionsValidationErrors.serviceContractAddressHasInvalidLength];
    if (!tezosInfo.contractAddressPrefixes.some(prefix => serviceContractAddress.startsWith(prefix))) return [TezosPayments.optionsValidationErrors.serviceContractAddressIsNotContractAddress];
  }

  validateSigningOptions(signingOptions) {
    if (typeof signingOptions !== 'object') return [TezosPayments.optionsValidationErrors.invalidSigningOption];
    if (typeof signingOptions === 'function') return;else if (!('apiSecretKey' in signingOptions) && !('walletSigning' in signingOptions)) return [TezosPayments.optionsValidationErrors.invalidSigningOption];

    if ('apiSecretKey' in signingOptions) {
      if (typeof signingOptions.apiSecretKey !== 'string') return [TezosPayments.optionsValidationErrors.invalidApiSecretKeyType];
      if (!signingOptions.apiSecretKey) return [TezosPayments.optionsValidationErrors.emptyApiSecretKey];
    }

    if ('walletSigning' in signingOptions && typeof signingOptions.walletSigning !== 'function') return [TezosPayments.optionsValidationErrors.invalidWalletSigningOptionType];
  }

  validateDefaultPaymentParameters(defaultPaymentParameters) {
    if (defaultPaymentParameters === undefined) return;
    if (typeof defaultPaymentParameters !== 'object') return [TezosPayments.optionsValidationErrors.invalidDefaultPaymentParameters];

    if ('network' in defaultPaymentParameters) {
      if (typeof defaultPaymentParameters.network !== 'object') return [TezosPayments.optionsValidationErrors.invalidNetwork];
      if (defaultPaymentParameters.network.name === undefined || defaultPaymentParameters.network.name === '') return [TezosPayments.optionsValidationErrors.emptyNetworkName];
      if (typeof defaultPaymentParameters.network.name !== 'string' || !networkNameRegExp.test(defaultPaymentParameters.network.name)) return [TezosPayments.optionsValidationErrors.invalidNetworkName];
      if (defaultPaymentParameters.network.id && (typeof defaultPaymentParameters.network.id !== 'string' || !networkIdRegExp.test(defaultPaymentParameters.network.id))) return [TezosPayments.optionsValidationErrors.invalidNetworkId];
    }

    if ('urlType' in defaultPaymentParameters && defaultPaymentParameters.urlType !== PaymentUrlType.Base64) return [TezosPayments.optionsValidationErrors.invalidUrlType];
  }

}

_defineProperty(TezosPayments, "defaultPaymentParameters", {
  network: networks.granadanet,
  urlType: PaymentUrlType.Base64
});

_defineProperty(TezosPayments, "optionsValidationErrors", tezosPaymentsOptionsValidationErrors);

const internal = {
  constants,
  errors,
  paymentUrlFactories,
  signers
};

export { SigningType, TezosPayments, internal };
//# sourceMappingURL=index.mjs.map
