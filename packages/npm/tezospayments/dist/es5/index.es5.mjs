import _createClass from '@babel/runtime/helpers/createClass';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import _wrapNativeSuper from '@babel/runtime/helpers/wrapNativeSuper';
import { guards, PaymentUrlType, PaymentSerializer, DonationSerializer, PaymentType, native, getEncodedPaymentUrlType, PaymentSignPayloadEncoder, networks, tezosInfo, networkNameRegExp, networkIdRegExp, PaymentValidator } from '@tezospayments/common';
export { PaymentUrlType } from '@tezospayments/common';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import { InMemorySigner } from '@taquito/signer';
import _typeof from '@babel/runtime/helpers/typeof';
import BigNumber from 'bignumber.js';
import { nanoid } from 'nanoid';

var constants = {
  defaultNetworkName: 'mainnet',
  paymentAppBaseUrl: 'https://payment.tezospayments.com'
};

function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var getErrorMessageByValidationErrors = function getErrorMessageByValidationErrors(validationErrors) {
  var brief = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return validationErrors.reduce(function (result, error, index) {
    return "".concat(result, "\n\t").concat(index + 1, ". ").concat(error, ";");
  }, brief);
};

var TezosPaymentsError = /*#__PURE__*/function (_Error) {
  _inherits(TezosPaymentsError, _Error);

  var _super = _createSuper$4(TezosPaymentsError);

  function TezosPaymentsError(message) {
    var _this;

    _classCallCheck(this, TezosPaymentsError);

    _this = _super.call(this, message);
    _this.name = _this.constructor.name;
    return _this;
  }

  return TezosPaymentsError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
var InvalidTezosPaymentsOptionsError = /*#__PURE__*/function (_TezosPaymentsError) {
  _inherits(InvalidTezosPaymentsOptionsError, _TezosPaymentsError);

  var _super2 = _createSuper$4(InvalidTezosPaymentsOptionsError);

  function InvalidTezosPaymentsOptionsError(messageOrValidationErrors) {
    _classCallCheck(this, InvalidTezosPaymentsOptionsError);

    return _super2.call(this, guards.isReadonlyArray(messageOrValidationErrors) ? InvalidTezosPaymentsOptionsError.getMessage(messageOrValidationErrors) : messageOrValidationErrors);
  }

  _createClass(InvalidTezosPaymentsOptionsError, null, [{
    key: "getMessage",
    value: function getMessage(validationErrors) {
      return getErrorMessageByValidationErrors(validationErrors, 'options are invalid, see details below:');
    }
  }]);

  return InvalidTezosPaymentsOptionsError;
}(TezosPaymentsError);
var InvalidPaymentCreateParametersError = /*#__PURE__*/function (_TezosPaymentsError2) {
  _inherits(InvalidPaymentCreateParametersError, _TezosPaymentsError2);

  var _super3 = _createSuper$4(InvalidPaymentCreateParametersError);

  function InvalidPaymentCreateParametersError() {
    _classCallCheck(this, InvalidPaymentCreateParametersError);

    return _super3.apply(this, arguments);
  }

  return InvalidPaymentCreateParametersError;
}(TezosPaymentsError);
var InvalidPaymentError = /*#__PURE__*/function (_TezosPaymentsError3) {
  _inherits(InvalidPaymentError, _TezosPaymentsError3);

  var _super4 = _createSuper$4(InvalidPaymentError);

  function InvalidPaymentError(messageOrValidationErrors) {
    _classCallCheck(this, InvalidPaymentError);

    return _super4.call(this, guards.isReadonlyArray(messageOrValidationErrors) ? InvalidPaymentError.getMessage(messageOrValidationErrors) : messageOrValidationErrors);
  }

  _createClass(InvalidPaymentError, null, [{
    key: "getMessage",
    value: function getMessage(validationErrors) {
      return getErrorMessageByValidationErrors(validationErrors, 'payment is invalid, see details below:');
    }
  }]);

  return InvalidPaymentError;
}(TezosPaymentsError);
var UnsupportedPaymentUrlTypeError = /*#__PURE__*/function (_TezosPaymentsError4) {
  _inherits(UnsupportedPaymentUrlTypeError, _TezosPaymentsError4);

  var _super5 = _createSuper$4(UnsupportedPaymentUrlTypeError);

  function UnsupportedPaymentUrlTypeError() {
    _classCallCheck(this, UnsupportedPaymentUrlTypeError);

    return _super5.apply(this, arguments);
  }

  return UnsupportedPaymentUrlTypeError;
}(TezosPaymentsError);
var PaymentUrlError = /*#__PURE__*/function (_TezosPaymentsError5) {
  _inherits(PaymentUrlError, _TezosPaymentsError5);

  var _super6 = _createSuper$4(PaymentUrlError);

  function PaymentUrlError() {
    _classCallCheck(this, PaymentUrlError);

    return _super6.apply(this, arguments);
  }

  return PaymentUrlError;
}(TezosPaymentsError);
var DonationUrlError = /*#__PURE__*/function (_TezosPaymentsError6) {
  _inherits(DonationUrlError, _TezosPaymentsError6);

  var _super7 = _createSuper$4(DonationUrlError);

  function DonationUrlError() {
    _classCallCheck(this, DonationUrlError);

    return _super7.apply(this, arguments);
  }

  return DonationUrlError;
}(TezosPaymentsError);

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

var PaymentUrlFactory = function PaymentUrlFactory(urlType) {
  _classCallCheck(this, PaymentUrlFactory);

  this.urlType = urlType;
};

function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Base64PaymentUrlFactory = /*#__PURE__*/function (_PaymentUrlFactory) {
  _inherits(Base64PaymentUrlFactory, _PaymentUrlFactory);

  var _super = _createSuper$3(Base64PaymentUrlFactory);

  function Base64PaymentUrlFactory() {
    var _this;

    var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Base64PaymentUrlFactory.baseUrl;

    _classCallCheck(this, Base64PaymentUrlFactory);

    _this = _super.call(this, PaymentUrlType.Base64);

    _defineProperty(_assertThisInitialized(_this), "paymentSerializer", new PaymentSerializer());

    _defineProperty(_assertThisInitialized(_this), "donationSerializer", new DonationSerializer());

    _this.baseUrl = baseUrl;
    return _this;
  }

  _createClass(Base64PaymentUrlFactory, [{
    key: "createPaymentUrl",
    value: function createPaymentUrl(paymentOrDonation, network) {
      return paymentOrDonation.type === PaymentType.Payment ? this.createPaymentUrlInternal(paymentOrDonation, network) : this.createDonationUrlInternal(paymentOrDonation, network);
    }
  }, {
    key: "createPaymentUrlInternal",
    value: function createPaymentUrlInternal(payment, network) {
      var serializedPaymentBase64 = this.paymentSerializer.serialize(payment);
      if (!serializedPaymentBase64) throw new PaymentUrlError('It\'s impossible to serialize the payment');

      try {
        return this.createUrl(true, payment.targetAddress, serializedPaymentBase64, network);
      } catch (error) {
        throw new PaymentUrlError('It\'s impossible to create an URL for the payment');
      }
    }
  }, {
    key: "createDonationUrlInternal",
    value: function createDonationUrlInternal(donation, network) {
      var serializedDonationBase64 = this.donationSerializer.serialize(donation);
      if (!serializedDonationBase64 && serializedDonationBase64 !== '') throw new DonationUrlError('It\'s impossible to serialize the donation');

      try {
        return this.createUrl(false, donation.targetAddress, serializedDonationBase64, network);
      } catch (error) {
        throw new DonationUrlError('It\'s impossible to create an URL for the donation');
      }
    }
  }, {
    key: "createUrl",
    value: function createUrl(isPayment, targetAddress, serializedPaymentOrDonationBase64, network) {
      var url = new native.URL("".concat(targetAddress, "/").concat(isPayment ? 'payment' : 'donation'), this.baseUrl);
      if (serializedPaymentOrDonationBase64 !== '') url.hash = getEncodedPaymentUrlType(this.urlType) + serializedPaymentOrDonationBase64;
      if (network.name !== constants.defaultNetworkName) url.searchParams.append('network', network.name);
      return url.href;
    }
  }]);

  return Base64PaymentUrlFactory;
}(PaymentUrlFactory);

_defineProperty(Base64PaymentUrlFactory, "baseUrl", constants.paymentAppBaseUrl);

var paymentUrlFactories = /*#__PURE__*/Object.freeze({
  __proto__: null,
  PaymentUrlFactory: PaymentUrlFactory,
  Base64PaymentUrlFactory: Base64PaymentUrlFactory
});

var TezosPaymentsSigner = function TezosPaymentsSigner(signingType) {
  _classCallCheck(this, TezosPaymentsSigner);

  this.signingType = signingType;
};

var SigningType;

(function (SigningType) {
  SigningType[SigningType["ApiSecretKey"] = 0] = "ApiSecretKey";
  SigningType[SigningType["Wallet"] = 1] = "Wallet";
  SigningType[SigningType["Custom"] = 2] = "Custom";
})(SigningType || (SigningType = {}));

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ApiSecretKeySigner = /*#__PURE__*/function (_TezosPaymentsSigner) {
  _inherits(ApiSecretKeySigner, _TezosPaymentsSigner);

  var _super = _createSuper$2(ApiSecretKeySigner);

  function ApiSecretKeySigner(apiSecretKey) {
    var _this;

    _classCallCheck(this, ApiSecretKeySigner);

    _this = _super.call(this, SigningType.ApiSecretKey);

    _defineProperty(_assertThisInitialized(_this), "paymentSignPayloadEncoder", new PaymentSignPayloadEncoder());

    _this.apiSecretKey = apiSecretKey;
    _this.inMemorySigner = new InMemorySigner(_this.apiSecretKey);
    return _this;
  }

  _createClass(ApiSecretKeySigner, [{
    key: "sign",
    value: function () {
      var _sign = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(payment) {
        var _signatures$;

        var signPayload, contractSigningPromise, signingPromises, signatures;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                signPayload = this.paymentSignPayloadEncoder.encode(payment);
                contractSigningPromise = this.inMemorySigner.sign(signPayload.contractSignPayload);
                signingPromises = signPayload.clientSignPayload ? [contractSigningPromise, this.inMemorySigner.sign(signPayload.clientSignPayload)] : [contractSigningPromise]; // TODO: add "[Awaited<ReturnType<typeof this.inMemorySigner.sign>>, Awaited<ReturnType<typeof this.inMemorySigner.sign>>?]" type

                _context.next = 5;
                return Promise.all(signingPromises);

              case 5:
                signatures = _context.sent;
                _context.next = 8;
                return this.inMemorySigner.publicKey();

              case 8:
                _context.t0 = _context.sent;
                _context.t1 = signatures[0].prefixSig;
                _context.t2 = (_signatures$ = signatures[1]) === null || _signatures$ === void 0 ? void 0 : _signatures$.prefixSig;
                return _context.abrupt("return", {
                  signingPublicKey: _context.t0,
                  contract: _context.t1,
                  client: _context.t2
                });

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sign(_x) {
        return _sign.apply(this, arguments);
      }

      return sign;
    }()
  }]);

  return ApiSecretKeySigner;
}(TezosPaymentsSigner);

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var WalletSigner = /*#__PURE__*/function (_TezosPaymentsSigner) {
  _inherits(WalletSigner, _TezosPaymentsSigner);

  var _super = _createSuper$1(WalletSigner);

  function WalletSigner(walletSigning) {
    var _this;

    _classCallCheck(this, WalletSigner);

    _this = _super.call(this, SigningType.Wallet);

    _defineProperty(_assertThisInitialized(_this), "paymentSignPayloadEncoder", new PaymentSignPayloadEncoder());

    _this.walletSigning = walletSigning;
    return _this;
  }

  _createClass(WalletSigner, [{
    key: "sign",
    value: function () {
      var _sign = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(payment) {
        var signPayload, walletContractSignPayload, contractSigningPromise, signingPromises, signatures;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                signPayload = this.paymentSignPayloadEncoder.encode(payment);
                walletContractSignPayload = signPayload.contractSignPayload.substring(2);
                contractSigningPromise = this.walletSigning(walletContractSignPayload);
                signingPromises = signPayload.clientSignPayload ? [contractSigningPromise, this.walletSigning(signPayload.clientSignPayload)] : [contractSigningPromise]; // TODO: add "[Awaited<ReturnType<typeof this.inMemorySigner.sign>>, Awaited<ReturnType<typeof this.inMemorySigner.sign>>?]" type

                _context.next = 6;
                return Promise.all(signingPromises);

              case 6:
                signatures = _context.sent;
                return _context.abrupt("return", {
                  signingPublicKey: '',
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  contract: signatures[0],
                  client: signatures[1]
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sign(_x) {
        return _sign.apply(this, arguments);
      }

      return sign;
    }()
  }]);

  return WalletSigner;
}(TezosPaymentsSigner);

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var CustomSigner = /*#__PURE__*/function (_TezosPaymentsSigner) {
  _inherits(CustomSigner, _TezosPaymentsSigner);

  var _super = _createSuper(CustomSigner);

  function CustomSigner(customSigning) {
    var _this;

    _classCallCheck(this, CustomSigner);

    _this = _super.call(this, SigningType.Custom);
    _this.customSigning = customSigning;
    return _this;
  }

  _createClass(CustomSigner, [{
    key: "sign",
    value: function sign(_payment) {
      throw new Error('Method not implemented.');
    }
  }]);

  return CustomSigner;
}(TezosPaymentsSigner);

var signers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  TezosPaymentsSigner: TezosPaymentsSigner,
  ApiSecretKeySigner: ApiSecretKeySigner,
  WalletSigner: WalletSigner,
  CustomSigner: CustomSigner
});

var tezosPaymentsOptionsValidationErrors = {
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

var TezosPayments = /*#__PURE__*/function () {
  function TezosPayments(options) {
    _classCallCheck(this, TezosPayments);

    _defineProperty(this, "paymentValidator", new PaymentValidator());

    _defineProperty(this, "paymentUrlFactories", new Map());

    var errors = this.validateOptions(options);
    if (errors) throw new InvalidTezosPaymentsOptionsError(errors);
    this.serviceContractAddress = options.serviceContractAddress;
    this.defaultPaymentParameters = options.defaultPaymentParameters ? {
      network: options.defaultPaymentParameters.network || TezosPayments.defaultPaymentParameters.network,
      urlType: options.defaultPaymentParameters.urlType || TezosPayments.defaultPaymentParameters.urlType
    } : TezosPayments.defaultPaymentParameters;
    this.signer = this.createSigner(options.signing);
    this.getPaymentUrlFactory(this.defaultPaymentParameters.urlType);
  }

  _createClass(TezosPayments, [{
    key: "createPayment",
    value: function () {
      var _createPayment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(createParameters) {
        var errors, unsignedPayment, signedPayment, paymentUrl, payment;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (createParameters) {
                  _context.next = 2;
                  break;
                }

                throw new InvalidPaymentCreateParametersError(createParameters);

              case 2:
                if (!createParameters.urlType) {
                  _context.next = 6;
                  break;
                }

                errors = this.validateDefaultPaymentParameters(createParameters);

                if (!errors) {
                  _context.next = 6;
                  break;
                }

                throw new InvalidPaymentError(errors);

              case 6:
                unsignedPayment = this.createPaymentByCreateParameters(createParameters);
                errors = this.paymentValidator.validate(unsignedPayment, true);

                if (!errors) {
                  _context.next = 10;
                  break;
                }

                throw new InvalidPaymentError(errors);

              case 10:
                _context.next = 12;
                return this.getSignedPayment(unsignedPayment);

              case 12:
                signedPayment = _context.sent;
                errors = this.paymentValidator.validate(signedPayment, true);

                if (!errors) {
                  _context.next = 16;
                  break;
                }

                throw new InvalidPaymentError(errors);

              case 16:
                _context.next = 18;
                return this.getPaymentUrl(signedPayment, createParameters.urlType);

              case 18:
                paymentUrl = _context.sent;
                payment = this.applyPaymentUrl(signedPayment, paymentUrl);
                return _context.abrupt("return", payment);

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createPayment(_x) {
        return _createPayment.apply(this, arguments);
      }

      return createPayment;
    }()
  }, {
    key: "getPaymentUrl",
    value: function getPaymentUrl(payment) {
      var urlType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaultPaymentParameters.urlType;
      return this.getPaymentUrlFactory(urlType).createPaymentUrl(payment, this.defaultPaymentParameters.network);
    }
  }, {
    key: "applyPaymentUrl",
    value: function applyPaymentUrl(payment, url) {
      payment.url = url;
      return payment;
    }
  }, {
    key: "getPaymentUrlFactory",
    value: function getPaymentUrlFactory(paymentUrlType) {
      var paymentUrlFactory = this.paymentUrlFactories.get(paymentUrlType);

      if (!paymentUrlFactory) {
        paymentUrlFactory = this.createPaymentUrlFactory(paymentUrlType);
        this.paymentUrlFactories.set(paymentUrlType, paymentUrlFactory);
      }

      return paymentUrlFactory;
    }
  }, {
    key: "getSignedPayment",
    value: function () {
      var _getSignedPayment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(unsignedPayment) {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.signer.sign(unsignedPayment);

              case 2:
                unsignedPayment.signature = _context2.sent;
                return _context2.abrupt("return", unsignedPayment);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getSignedPayment(_x2) {
        return _getSignedPayment.apply(this, arguments);
      }

      return getSignedPayment;
    }()
  }, {
    key: "createSigner",
    value: function createSigner(signingOptions) {
      if ('apiSecretKey' in signingOptions) return new ApiSecretKeySigner(signingOptions.apiSecretKey);
      if ('walletSigning' in signingOptions) return new WalletSigner(signingOptions.walletSigning);
      return new CustomSigner(signingOptions);
    }
  }, {
    key: "createPaymentUrlFactory",
    value: function createPaymentUrlFactory(paymentUrlType) {
      switch (paymentUrlType) {
        case PaymentUrlType.Base64:
          return new Base64PaymentUrlFactory();

        default:
          throw new UnsupportedPaymentUrlTypeError("This payment url type is not supported: ".concat(paymentUrlType));
      }
    }
  }, {
    key: "createPaymentByCreateParameters",
    value: function createPaymentByCreateParameters(createParameters) {
      // TODO: check decimals
      // TODO: floor amount to decimals count: new BigNumber(amount).toFixed(asset.decimals)
      var payment = {
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
  }, {
    key: "validateOptions",
    value: function validateOptions(options) {
      return [this.validateServiceContractAddress(options.serviceContractAddress), this.validateSigningOptions(options.signing), this.validateDefaultPaymentParameters(options.defaultPaymentParameters)].reduce(function (result, currentErrors) {
        return currentErrors ? (result || []).concat(currentErrors) : result;
      }, undefined);
    }
  }, {
    key: "validateServiceContractAddress",
    value: function validateServiceContractAddress(serviceContractAddress) {
      if (!serviceContractAddress || typeof serviceContractAddress !== 'string') return [TezosPayments.optionsValidationErrors.invalidServiceContractAddressType];
      if (serviceContractAddress.length !== tezosInfo.addressLength) return [TezosPayments.optionsValidationErrors.serviceContractAddressHasInvalidLength];
      if (!tezosInfo.contractAddressPrefixes.some(function (prefix) {
        return serviceContractAddress.startsWith(prefix);
      })) return [TezosPayments.optionsValidationErrors.serviceContractAddressIsNotContractAddress];
    }
  }, {
    key: "validateSigningOptions",
    value: function validateSigningOptions(signingOptions) {
      if (_typeof(signingOptions) !== 'object') return [TezosPayments.optionsValidationErrors.invalidSigningOption];
      if (typeof signingOptions === 'function') return;else if (!('apiSecretKey' in signingOptions) && !('walletSigning' in signingOptions)) return [TezosPayments.optionsValidationErrors.invalidSigningOption];

      if ('apiSecretKey' in signingOptions) {
        if (typeof signingOptions.apiSecretKey !== 'string') return [TezosPayments.optionsValidationErrors.invalidApiSecretKeyType];
        if (!signingOptions.apiSecretKey) return [TezosPayments.optionsValidationErrors.emptyApiSecretKey];
      }

      if ('walletSigning' in signingOptions && typeof signingOptions.walletSigning !== 'function') return [TezosPayments.optionsValidationErrors.invalidWalletSigningOptionType];
    }
  }, {
    key: "validateDefaultPaymentParameters",
    value: function validateDefaultPaymentParameters(defaultPaymentParameters) {
      if (defaultPaymentParameters === undefined) return;
      if (_typeof(defaultPaymentParameters) !== 'object') return [TezosPayments.optionsValidationErrors.invalidDefaultPaymentParameters];

      if ('network' in defaultPaymentParameters) {
        if (_typeof(defaultPaymentParameters.network) !== 'object') return [TezosPayments.optionsValidationErrors.invalidNetwork];
        if (defaultPaymentParameters.network.name === undefined || defaultPaymentParameters.network.name === '') return [TezosPayments.optionsValidationErrors.emptyNetworkName];
        if (typeof defaultPaymentParameters.network.name !== 'string' || !networkNameRegExp.test(defaultPaymentParameters.network.name)) return [TezosPayments.optionsValidationErrors.invalidNetworkName];
        if (defaultPaymentParameters.network.id && (typeof defaultPaymentParameters.network.id !== 'string' || !networkIdRegExp.test(defaultPaymentParameters.network.id))) return [TezosPayments.optionsValidationErrors.invalidNetworkId];
      }

      if ('urlType' in defaultPaymentParameters && defaultPaymentParameters.urlType !== PaymentUrlType.Base64) return [TezosPayments.optionsValidationErrors.invalidUrlType];
    }
  }]);

  return TezosPayments;
}();

_defineProperty(TezosPayments, "defaultPaymentParameters", {
  network: networks.granadanet,
  urlType: PaymentUrlType.Base64
});

_defineProperty(TezosPayments, "optionsValidationErrors", tezosPaymentsOptionsValidationErrors);

var internal = {
  constants: constants,
  errors: errors,
  paymentUrlFactories: paymentUrlFactories,
  signers: signers
};

export { SigningType, TezosPayments, internal };
//# sourceMappingURL=index.es5.mjs.map
