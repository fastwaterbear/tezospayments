'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _createClass = require('@babel/runtime/helpers/createClass');
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _inherits = require('@babel/runtime/helpers/inherits');
var _possibleConstructorReturn = require('@babel/runtime/helpers/possibleConstructorReturn');
var _getPrototypeOf = require('@babel/runtime/helpers/getPrototypeOf');
var _wrapNativeSuper = require('@babel/runtime/helpers/wrapNativeSuper');
var common = require('@tezospayments/common');
var _assertThisInitialized = require('@babel/runtime/helpers/assertThisInitialized');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var _typeof = require('@babel/runtime/helpers/typeof');
var _asyncToGenerator = require('@babel/runtime/helpers/asyncToGenerator');
var _regeneratorRuntime = require('@babel/runtime/regenerator');
var BigNumber = require('bignumber.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _inherits__default = /*#__PURE__*/_interopDefaultLegacy(_inherits);
var _possibleConstructorReturn__default = /*#__PURE__*/_interopDefaultLegacy(_possibleConstructorReturn);
var _getPrototypeOf__default = /*#__PURE__*/_interopDefaultLegacy(_getPrototypeOf);
var _wrapNativeSuper__default = /*#__PURE__*/_interopDefaultLegacy(_wrapNativeSuper);
var _assertThisInitialized__default = /*#__PURE__*/_interopDefaultLegacy(_assertThisInitialized);
var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var BigNumber__default = /*#__PURE__*/_interopDefaultLegacy(BigNumber);

var constants = {
  defaultNetworkName: 'mainnet',
  paymentAppBaseUrl: 'https://payment.tezospayments.com'
};

function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = _getPrototypeOf__default['default'](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default['default'](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default['default'](this, result); }; }

function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var getErrorMessageByValidationErrors = function getErrorMessageByValidationErrors(validationErrors) {
  var brief = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return validationErrors.reduce(function (result, error, index) {
    return "".concat(result, "\n\t").concat(index + 1, ". ").concat(error, ";");
  }, brief);
};

var TezosPaymentsError = /*#__PURE__*/function (_Error) {
  _inherits__default['default'](TezosPaymentsError, _Error);

  var _super = _createSuper$4(TezosPaymentsError);

  function TezosPaymentsError(message) {
    var _this;

    _classCallCheck__default['default'](this, TezosPaymentsError);

    _this = _super.call(this, message);
    _this.name = _this.constructor.name;
    return _this;
  }

  return TezosPaymentsError;
}( /*#__PURE__*/_wrapNativeSuper__default['default'](Error));
var InvalidTezosPaymentsOptionsError = /*#__PURE__*/function (_TezosPaymentsError) {
  _inherits__default['default'](InvalidTezosPaymentsOptionsError, _TezosPaymentsError);

  var _super2 = _createSuper$4(InvalidTezosPaymentsOptionsError);

  function InvalidTezosPaymentsOptionsError(messageOrValidationErrors) {
    _classCallCheck__default['default'](this, InvalidTezosPaymentsOptionsError);

    return _super2.call(this, common.guards.isReadonlyArray(messageOrValidationErrors) ? InvalidTezosPaymentsOptionsError.getMessage(messageOrValidationErrors) : messageOrValidationErrors);
  }

  _createClass__default['default'](InvalidTezosPaymentsOptionsError, null, [{
    key: "getMessage",
    value: function getMessage(validationErrors) {
      return getErrorMessageByValidationErrors(validationErrors, 'options are invalid, see details below:');
    }
  }]);

  return InvalidTezosPaymentsOptionsError;
}(TezosPaymentsError);
var InvalidPaymentCreateParametersError = /*#__PURE__*/function (_TezosPaymentsError2) {
  _inherits__default['default'](InvalidPaymentCreateParametersError, _TezosPaymentsError2);

  var _super3 = _createSuper$4(InvalidPaymentCreateParametersError);

  function InvalidPaymentCreateParametersError() {
    _classCallCheck__default['default'](this, InvalidPaymentCreateParametersError);

    return _super3.apply(this, arguments);
  }

  return InvalidPaymentCreateParametersError;
}(TezosPaymentsError);
var InvalidPaymentError = /*#__PURE__*/function (_TezosPaymentsError3) {
  _inherits__default['default'](InvalidPaymentError, _TezosPaymentsError3);

  var _super4 = _createSuper$4(InvalidPaymentError);

  function InvalidPaymentError(messageOrValidationErrors) {
    _classCallCheck__default['default'](this, InvalidPaymentError);

    return _super4.call(this, common.guards.isReadonlyArray(messageOrValidationErrors) ? InvalidPaymentError.getMessage(messageOrValidationErrors) : messageOrValidationErrors);
  }

  _createClass__default['default'](InvalidPaymentError, null, [{
    key: "getMessage",
    value: function getMessage(validationErrors) {
      return getErrorMessageByValidationErrors(validationErrors, 'payment is invalid, see details below:');
    }
  }]);

  return InvalidPaymentError;
}(TezosPaymentsError);
var UnsupportedPaymentUrlTypeError = /*#__PURE__*/function (_TezosPaymentsError4) {
  _inherits__default['default'](UnsupportedPaymentUrlTypeError, _TezosPaymentsError4);

  var _super5 = _createSuper$4(UnsupportedPaymentUrlTypeError);

  function UnsupportedPaymentUrlTypeError() {
    _classCallCheck__default['default'](this, UnsupportedPaymentUrlTypeError);

    return _super5.apply(this, arguments);
  }

  return UnsupportedPaymentUrlTypeError;
}(TezosPaymentsError);
var PaymentUrlError = /*#__PURE__*/function (_TezosPaymentsError5) {
  _inherits__default['default'](PaymentUrlError, _TezosPaymentsError5);

  var _super6 = _createSuper$4(PaymentUrlError);

  function PaymentUrlError() {
    _classCallCheck__default['default'](this, PaymentUrlError);

    return _super6.apply(this, arguments);
  }

  return PaymentUrlError;
}(TezosPaymentsError);
var DonationUrlError = /*#__PURE__*/function (_TezosPaymentsError6) {
  _inherits__default['default'](DonationUrlError, _TezosPaymentsError6);

  var _super7 = _createSuper$4(DonationUrlError);

  function DonationUrlError() {
    _classCallCheck__default['default'](this, DonationUrlError);

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
  _classCallCheck__default['default'](this, PaymentUrlFactory);

  this.urlType = urlType;
};

function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf__default['default'](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default['default'](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default['default'](this, result); }; }

function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Base64PaymentUrlFactory = /*#__PURE__*/function (_PaymentUrlFactory) {
  _inherits__default['default'](Base64PaymentUrlFactory, _PaymentUrlFactory);

  var _super = _createSuper$3(Base64PaymentUrlFactory);

  function Base64PaymentUrlFactory() {
    var _this;

    var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Base64PaymentUrlFactory.baseUrl;

    _classCallCheck__default['default'](this, Base64PaymentUrlFactory);

    _this = _super.call(this, common.PaymentUrlType.Base64);

    _defineProperty__default['default'](_assertThisInitialized__default['default'](_this), "paymentSerializer", new common.PaymentSerializer());

    _defineProperty__default['default'](_assertThisInitialized__default['default'](_this), "donationSerializer", new common.DonationSerializer());

    _this.baseUrl = baseUrl;
    return _this;
  }

  _createClass__default['default'](Base64PaymentUrlFactory, [{
    key: "createPaymentUrl",
    value: function createPaymentUrl(paymentOrDonation, network) {
      return paymentOrDonation.type === common.PaymentType.Payment ? this.createPaymentUrlInternal(paymentOrDonation, network) : this.createDonationUrlInternal(paymentOrDonation, network);
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
      var url = new common.native.URL("".concat(targetAddress, "/").concat(isPayment ? 'payment' : 'donation'), this.baseUrl);
      if (serializedPaymentOrDonationBase64 !== '') url.hash = common.getEncodedPaymentUrlType(this.urlType) + serializedPaymentOrDonationBase64;
      if (network.name !== constants.defaultNetworkName) url.searchParams.append('network', network.name);
      return url.href;
    }
  }]);

  return Base64PaymentUrlFactory;
}(PaymentUrlFactory);

_defineProperty__default['default'](Base64PaymentUrlFactory, "baseUrl", constants.paymentAppBaseUrl);

var paymentUrlFactories = /*#__PURE__*/Object.freeze({
  __proto__: null,
  PaymentUrlFactory: PaymentUrlFactory,
  Base64PaymentUrlFactory: Base64PaymentUrlFactory
});

var TezosPaymentsSigner = function TezosPaymentsSigner(signingType) {
  _classCallCheck__default['default'](this, TezosPaymentsSigner);

  this.signingType = signingType;
};

exports.SigningType = void 0;

(function (SigningType) {
  SigningType[SigningType["ApiSecretKey"] = 0] = "ApiSecretKey";
  SigningType[SigningType["Wallet"] = 1] = "Wallet";
  SigningType[SigningType["Custom"] = 2] = "Custom";
})(exports.SigningType || (exports.SigningType = {}));

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf__default['default'](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default['default'](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default['default'](this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ApiSecretKeySigner = /*#__PURE__*/function (_TezosPaymentsSigner) {
  _inherits__default['default'](ApiSecretKeySigner, _TezosPaymentsSigner);

  var _super = _createSuper$2(ApiSecretKeySigner);

  function ApiSecretKeySigner(apiSecretKey) {
    var _this;

    _classCallCheck__default['default'](this, ApiSecretKeySigner);

    _this = _super.call(this, exports.SigningType.ApiSecretKey);
    _this.apiSecretKey = apiSecretKey;
    return _this;
  }

  _createClass__default['default'](ApiSecretKeySigner, [{
    key: "sign",
    value: function sign(_payment) {
      throw new Error('Method not implemented.');
    }
  }]);

  return ApiSecretKeySigner;
}(TezosPaymentsSigner);

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf__default['default'](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default['default'](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default['default'](this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var WalletSigner = /*#__PURE__*/function (_TezosPaymentsSigner) {
  _inherits__default['default'](WalletSigner, _TezosPaymentsSigner);

  var _super = _createSuper$1(WalletSigner);

  function WalletSigner(walletSigning) {
    var _this;

    _classCallCheck__default['default'](this, WalletSigner);

    _this = _super.call(this, exports.SigningType.Wallet);
    _this.walletSigning = walletSigning;
    return _this;
  }

  _createClass__default['default'](WalletSigner, [{
    key: "sign",
    value: function sign(_payment) {
      throw new Error('Method not implemented.');
    }
  }]);

  return WalletSigner;
}(TezosPaymentsSigner);

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf__default['default'](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default['default'](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default['default'](this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var CustomSigner = /*#__PURE__*/function (_TezosPaymentsSigner) {
  _inherits__default['default'](CustomSigner, _TezosPaymentsSigner);

  var _super = _createSuper(CustomSigner);

  function CustomSigner(customSigning) {
    var _this;

    _classCallCheck__default['default'](this, CustomSigner);

    _this = _super.call(this, exports.SigningType.Custom);
    _this.customSigning = customSigning;
    return _this;
  }

  _createClass__default['default'](CustomSigner, [{
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
    _classCallCheck__default['default'](this, TezosPayments);

    _defineProperty__default['default'](this, "paymentValidator", new common.PaymentValidator());

    _defineProperty__default['default'](this, "paymentUrlFactories", new Map());

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

  _createClass__default['default'](TezosPayments, [{
    key: "createPayment",
    value: function () {
      var _createPayment = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee(createParameters) {
        var errors, paymentWithoutUrl, paymentUrl, payment;
        return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (createParameters) {
                  _context.next = 2;
                  break;
                }

                throw new InvalidPaymentCreateParametersError(createParameters);

              case 2:
                if (!(createParameters.urlType || createParameters.network)) {
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
                paymentWithoutUrl = this.createPaymentByCreateParameters(createParameters);
                errors = this.paymentValidator.validate(paymentWithoutUrl, true);

                if (!errors) {
                  _context.next = 10;
                  break;
                }

                throw new InvalidPaymentError(errors);

              case 10:
                _context.next = 12;
                return this.getPaymentUrl(paymentWithoutUrl, createParameters.urlType, createParameters.network);

              case 12:
                paymentUrl = _context.sent;
                payment = this.applyPaymentUrl(paymentWithoutUrl, paymentUrl);
                return _context.abrupt("return", payment);

              case 15:
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
      var network = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.defaultPaymentParameters.network;
      return this.getPaymentUrlFactory(urlType).createPaymentUrl(payment, network);
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
        case common.PaymentUrlType.Base64:
          return new Base64PaymentUrlFactory();

        default:
          throw new UnsupportedPaymentUrlTypeError("This payment url type is not supported: ".concat(paymentUrlType));
      }
    }
  }, {
    key: "createPaymentByCreateParameters",
    value: function createPaymentByCreateParameters(createParameters) {
      var payment = {
        type: common.PaymentType.Payment,
        targetAddress: this.serviceContractAddress,
        amount: new BigNumber__default['default'](createParameters.amount),
        data: createParameters.data,
        created: createParameters.created ? new Date(createParameters.created) : new Date()
      };
      if (createParameters.asset) payment.asset = createParameters.asset;
      if (createParameters.expired) payment.expired = new Date(createParameters.expired);
      if (createParameters.successUrl) payment.successUrl = new common.native.URL(createParameters.successUrl);
      if (createParameters.cancelUrl) payment.cancelUrl = new common.native.URL(createParameters.cancelUrl);
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
      if (serviceContractAddress.length !== common.tezosInfo.addressLength) return [TezosPayments.optionsValidationErrors.serviceContractAddressHasInvalidLength];
      if (!common.tezosInfo.contractAddressPrefixes.some(function (prefix) {
        return serviceContractAddress.startsWith(prefix);
      })) return [TezosPayments.optionsValidationErrors.serviceContractAddressIsNotContractAddress];
    }
  }, {
    key: "validateSigningOptions",
    value: function validateSigningOptions(signingOptions) {
      if (_typeof__default['default'](signingOptions) !== 'object') return [TezosPayments.optionsValidationErrors.invalidSigningOption];
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
      if (_typeof__default['default'](defaultPaymentParameters) !== 'object') return [TezosPayments.optionsValidationErrors.invalidDefaultPaymentParameters];

      if ('network' in defaultPaymentParameters) {
        if (_typeof__default['default'](defaultPaymentParameters.network) !== 'object') return [TezosPayments.optionsValidationErrors.invalidNetwork];
        if (defaultPaymentParameters.network.name === undefined || defaultPaymentParameters.network.name === '') return [TezosPayments.optionsValidationErrors.emptyNetworkName];
        if (typeof defaultPaymentParameters.network.name !== 'string' || !common.networkNameRegExp.test(defaultPaymentParameters.network.name)) return [TezosPayments.optionsValidationErrors.invalidNetworkName];
        if (defaultPaymentParameters.network.id && (typeof defaultPaymentParameters.network.id !== 'string' || !common.networkIdRegExp.test(defaultPaymentParameters.network.id))) return [TezosPayments.optionsValidationErrors.invalidNetworkId];
      }

      if ('urlType' in defaultPaymentParameters && defaultPaymentParameters.urlType !== common.PaymentUrlType.Base64) return [TezosPayments.optionsValidationErrors.invalidUrlType];
    }
  }]);

  return TezosPayments;
}();

_defineProperty__default['default'](TezosPayments, "defaultPaymentParameters", {
  network: common.networks.granadanet,
  urlType: common.PaymentUrlType.Base64
});

_defineProperty__default['default'](TezosPayments, "optionsValidationErrors", tezosPaymentsOptionsValidationErrors);

var internal = {
  constants: constants,
  errors: errors,
  paymentUrlFactories: paymentUrlFactories,
  signers: signers
};

Object.defineProperty(exports, 'PaymentUrlType', {
  enumerable: true,
  get: function () {
    return common.PaymentUrlType;
  }
});
exports.TezosPayments = TezosPayments;
exports.internal = internal;
//# sourceMappingURL=index.es5.cjs.js.map
