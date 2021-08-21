import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
export { default as combineClassNames } from 'clsx';
import { Buffer } from 'buffer';
import isPlainObjectLodashFunction from 'lodash.isplainobject';
import _typeof from '@babel/runtime/helpers/typeof';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import { BigNumber } from 'bignumber.js';
import { URL as URL$1 } from 'url';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';

var stringToUint8Array = function stringToUint8Array(hex) {
  var _hex$match;

  var integers = (_hex$match = hex.match(/[\da-f]{2}/gi)) === null || _hex$match === void 0 ? void 0 : _hex$match.map(function (val) {
    return parseInt(val, 16);
  }); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

  return new Uint8Array(integers);
};
var stringToBytes = function stringToBytes(value) {
  return Buffer.from(value, 'utf8').toString('hex');
};
var bytesToString = function bytesToString(value) {
  return Buffer.from(stringToUint8Array(value)).toString('utf8');
};
var objectToBytes = function objectToBytes(value) {
  return stringToBytes(JSON.stringify(value));
};
var bytesToObject = function bytesToObject(value) {
  try {
    return JSON.parse(bytesToString(value));
  } catch (_unused) {
    return null;
  }
};
function tezToMutez(tez) {
  return typeof tez === 'number' ? tez * 1000000 : tez * BigInt(1000000);
}

var converters = /*#__PURE__*/Object.freeze({
  __proto__: null,
  stringToUint8Array: stringToUint8Array,
  stringToBytes: stringToBytes,
  bytesToString: bytesToString,
  objectToBytes: objectToBytes,
  bytesToObject: bytesToObject,
  tezToMutez: tezToMutez
});

var isArray = function isArray(arg) {
  return Array.isArray(arg);
};
var isReadonlyArray = function isReadonlyArray(arg) {
  return Array.isArray(arg);
};
var isPlainObject = function isPlainObject(value) {
  return isPlainObjectLodashFunction(value);
};

var guards = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isArray: isArray,
  isReadonlyArray: isReadonlyArray,
  isPlainObject: isPlainObject
});

var defaultEqualityCheck = function defaultEqualityCheck(a, b) {
  return a === b;
};

var areArgumentsShallowlyEqual = function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  } // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.


  var length = prev.length;

  for (var i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
};
/* eslint-disable prefer-rest-params  */

/* eslint-disable prefer-spread */

/* eslint-disable @typescript-eslint/no-explicit-any */


var memoize = function memoize(func) {
  var equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;
  var lastArgs = null;
  var lastResult = null;
  return function () {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lastResult = func.apply(null, arguments);
    }

    lastArgs = arguments;
    return lastResult;
  };
};
/* eslint-enable prefer-spread */

/* eslint-enable prefer-rest-params */

/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
var emptyArray = [];
var emptyObject = {};
var emptyMap = new Map();
var emptySet = new Set();
var optimization = {
  emptyArray: emptyArray,
  emptyMap: emptyMap,
  emptySet: emptySet,
  emptyObject: emptyObject
};

var is = function is(x, y) {
  return x === y ? x !== 0 || y !== 0 || 1 / x === 1 / y : x !== x && y !== y;
};

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;
  if (_typeof(objA) !== 'object' || objA === null || _typeof(objB) !== 'object' || objB === null) return false;
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    /* eslint-disable @typescript-eslint/no-explicit-any */

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) return false;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  return true;
}

var capitalize = function capitalize(value) {
  var _value$;

  return value && ((_value$ = value[0]) === null || _value$ === void 0 ? void 0 : _value$.toLocaleUpperCase()) + value.slice(1);
};
var getAvatarText = function getAvatarText(value) {
  var maxLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  if (!value || !maxLength) return '';
  var result = '';

  for (var i = 0, j = 0, isWord = false; i < value.length; i++) {
    if (!isWord && value[i] !== ' ') {
      isWord = true; // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

      result += value[i];
      if (++j === maxLength) return result;
    } else if (isWord && value[i] === ' ') {
      isWord = false;
    }
  }

  return result;
};

var text = /*#__PURE__*/Object.freeze({
  __proto__: null,
  capitalize: capitalize,
  getAvatarText: getAvatarText
});

var wait = function wait(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};

function _createForOfIteratorHelper$3(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }

function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var IconId;

(function (IconId) {
  IconId[IconId["Common"] = 0] = "Common";
  IconId[IconId["Email"] = 1] = "Email";
  IconId[IconId["Telegram"] = 2] = "Telegram";
  IconId[IconId["Facebook"] = 3] = "Facebook";
  IconId[IconId["Twitter"] = 4] = "Twitter";
  IconId[IconId["Instagram"] = 5] = "Instagram";
  IconId[IconId["GitHub"] = 6] = "GitHub";
  IconId[IconId["Reddit"] = 7] = "Reddit";
})(IconId || (IconId = {}));

var getInvalidLinkInfo = function getInvalidLinkInfo(link) {
  return {
    rawLink: link,
    formattedLink: '#',
    displayLink: 'Invalid Link',
    icon: IconId.Common
  };
};

var prepareFormattedLink = memoize(function (link) {
  return link.trim();
});
var prepareDisplayLink = memoize(function (link) {
  return link.trim().replace(/\/$/, '');
});

var socialMediaLinkInfoProvider = function socialMediaLinkInfoProvider(link, baseUrl, icon) {
  if (!link.startsWith(baseUrl)) return false;
  var formattedLink = prepareFormattedLink(link);
  if (formattedLink == baseUrl) return false;
  return {
    rawLink: link,
    formattedLink: formattedLink,
    displayLink: prepareDisplayLink(link).replace(baseUrl, ''),
    icon: icon
  };
};

var telegramLinkInfoProvider = function telegramLinkInfoProvider(link) {
  return socialMediaLinkInfoProvider(link, 'https://t.me/', IconId.Telegram);
};

var facebookLinkInfoProvider = function facebookLinkInfoProvider(link) {
  return socialMediaLinkInfoProvider(link, 'https://facebook.com/', IconId.Facebook);
};

var twitterLinkInfoProvider = function twitterLinkInfoProvider(link) {
  return socialMediaLinkInfoProvider(link, 'https://twitter.com/', IconId.Twitter);
};

var instagramLinkInfoProvider = function instagramLinkInfoProvider(link) {
  return socialMediaLinkInfoProvider(link, 'https://instagram.com/', IconId.Instagram);
};

var gitHubLinkInfoProvider = function gitHubLinkInfoProvider(link) {
  return socialMediaLinkInfoProvider(link, 'https://github.com/', IconId.GitHub);
};

var redditLinkInfoProvider = function redditLinkInfoProvider(link) {
  return socialMediaLinkInfoProvider(link, 'https://www.reddit.com/', IconId.Reddit);
}; // This regex should not use for email validation


var emailCheckingRegEx = /^[^\s/@]+@[^\s@/]+$/;

var emailLinkInfoProvider = function emailLinkInfoProvider(link) {
  var preparedFormattedLink = prepareFormattedLink(link);
  return emailCheckingRegEx.test(preparedFormattedLink) && {
    rawLink: link,
    formattedLink: "mailto:".concat(preparedFormattedLink),
    displayLink: prepareDisplayLink(link),
    icon: IconId.Email
  };
};

var javascriptLinkInfoProvider = function javascriptLinkInfoProvider(link) {
  return link.startsWith('javascript') ? getInvalidLinkInfo(link) : false;
}; // https://datatracker.ietf.org/doc/html/rfc3986#section-3.1


var urlSchemeRegEx = /^([a-z][a-z0-9+\-.]*):/;

var commonLinkInfoProvider = function commonLinkInfoProvider(link) {
  var formattedLink = prepareFormattedLink(link);
  return urlSchemeRegEx.test(formattedLink) && {
    rawLink: link,
    formattedLink: formattedLink,
    displayLink: prepareDisplayLink(link),
    icon: IconId.Common
  };
};

var editLinkInfoProvider = function editLinkInfoProvider(link) {
  var formattedLink = prepareFormattedLink(link);
  return {
    rawLink: link,
    formattedLink: formattedLink,
    displayLink: prepareDisplayLink(link),
    icon: IconId.Common
  };
};

var ServiceLinkHelper = /*#__PURE__*/function () {
  function ServiceLinkHelper() {
    _classCallCheck(this, ServiceLinkHelper);
  }

  _createClass(ServiceLinkHelper, [{
    key: "getLinkInfo",
    value: // Order is important
    function getLinkInfo(link) {
      var isEditMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var _iterator = _createForOfIteratorHelper$3(ServiceLinkHelper.linkInfoProviders),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var provider = _step.value;
          var linkInfo = provider(link);
          if (linkInfo) return this.linkInfoIsValid(linkInfo) ? linkInfo : null;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (isEditMode) return editLinkInfoProvider(link);
      return null;
    }
  }, {
    key: "linkInfoIsValid",
    value: function linkInfoIsValid(linkInfo) {
      return linkInfo.formattedLink !== '#';
    }
  }]);

  return ServiceLinkHelper;
}();

_defineProperty(ServiceLinkHelper, "linkInfoProviders", [// Disallowed
javascriptLinkInfoProvider, // Allowed
telegramLinkInfoProvider, facebookLinkInfoProvider, twitterLinkInfoProvider, instagramLinkInfoProvider, gitHubLinkInfoProvider, emailLinkInfoProvider, redditLinkInfoProvider, commonLinkInfoProvider]);

var PaymentType;

(function (PaymentType) {
  PaymentType[PaymentType["Payment"] = 1] = "Payment";
  PaymentType[PaymentType["Donation"] = 2] = "Donation";
})(PaymentType || (PaymentType = {}));

/* eslint-disable @typescript-eslint/no-explicit-any */
var URL = URL$1 || globalThis.URL;

function _createForOfIteratorHelper$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var PaymentParserBase = /*#__PURE__*/function () {
  function PaymentParserBase() {
    _classCallCheck(this, PaymentParserBase);
  }

  _createClass(PaymentParserBase, [{
    key: "minPaymentFieldsCount",
    get: function get() {
      if (!this._minPaymentFieldsCount) {
        var count = 0;

        var _iterator = _createForOfIteratorHelper$2(this.paymentFieldTypes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var info = _step.value;
            if (typeof info[1] === 'string' ? info[1] !== 'undefined' : info[1].every(function (type) {
              return type !== 'undefined';
            })) count++;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this._minPaymentFieldsCount = count;
      }

      return this._minPaymentFieldsCount;
    }
  }, {
    key: "maxPaymentFieldsCount",
    get: function get() {
      return this.paymentFieldTypes.size;
    }
  }, {
    key: "parse",
    value: function parse(paymentBase64, nonIncludedFields) {
      try {
        var rawPayment;

        if (paymentBase64) {
          var paymentString = Buffer.from(paymentBase64, 'base64').toString('utf8');
          rawPayment = JSON.parse(paymentString);
        } else rawPayment = {};

        return this.validateAndMapRawPaymentToPayment(rawPayment, nonIncludedFields);
      } catch (_unused) {
        return null;
      }
    }
  }, {
    key: "validateAndMapRawPaymentToPayment",
    value: function validateAndMapRawPaymentToPayment(rawPayment, nonIncludedFields) {
      return this.validateRawPayment(rawPayment) ? this.mapRawPaymentToPayment(rawPayment, nonIncludedFields) : null;
    }
  }, {
    key: "validateRawPayment",
    value: function validateRawPayment(rawPayment) {
      var rawPaymentFieldNames = Object.getOwnPropertyNames(rawPayment); // Prevent the field checking if the rawPayment has an invalid number of fields

      if (rawPaymentFieldNames.length < this.minPaymentFieldsCount || rawPaymentFieldNames.length > this.maxPaymentFieldsCount) return false;

      var _iterator2 = _createForOfIteratorHelper$2(this.paymentFieldTypes),
          _step2;

      try {
        var _loop = function _loop() {
          var _step2$value = _slicedToArray(_step2.value, 2),
              rawPaymentFieldName = _step2$value[0],
              expectedPaymentFieldType = _step2$value[1];

          var actualPaymentFieldType = _typeof(rawPayment[rawPaymentFieldName]);

          if (Array.isArray(expectedPaymentFieldType) ? !expectedPaymentFieldType.some(function (expectedType) {
            return actualPaymentFieldType === expectedType;
          }) : actualPaymentFieldType !== expectedPaymentFieldType) {
            return {
              v: false
            };
          }
        };

        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _ret = _loop();

          if (_typeof(_ret) === "object") return _ret.v;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return true;
    }
  }]);

  return PaymentParserBase;
}();

function _createSuper$6(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$6(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$6() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var PaymentParser = /*#__PURE__*/function (_PaymentParserBase) {
  _inherits(PaymentParser, _PaymentParserBase);

  var _super = _createSuper$6(PaymentParser);

  function PaymentParser() {
    var _this;

    _classCallCheck(this, PaymentParser);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_paymentFieldTypes", new Map().set('amount', 'string').set('data', 'object').set('asset', ['string', 'undefined', 'null']).set('successUrl', ['string', 'undefined', 'null']).set('cancelUrl', ['string', 'undefined', 'null']).set('created', 'number').set('expired', ['number', 'undefined', 'null']));

    return _this;
  }

  _createClass(PaymentParser, [{
    key: "paymentFieldTypes",
    get: function get() {
      return this._paymentFieldTypes;
    }
  }, {
    key: "mapRawPaymentToPayment",
    value: function mapRawPaymentToPayment(rawPayment, nonIncludedFields) {
      return {
        type: PaymentType.Payment,
        amount: new BigNumber(rawPayment.amount),
        data: rawPayment.data,
        asset: rawPayment.asset,
        successUrl: rawPayment.successUrl ? new URL(rawPayment.successUrl) : undefined,
        cancelUrl: rawPayment.cancelUrl ? new URL(rawPayment.cancelUrl) : undefined,
        created: new Date(rawPayment.created),
        expired: rawPayment.expired ? new Date(rawPayment.expired) : undefined,
        targetAddress: nonIncludedFields.targetAddress,
        urls: nonIncludedFields.urls
      };
    }
  }]);

  return PaymentParser;
}(PaymentParserBase);

function _createSuper$5(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$5(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$5() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var DonationParser = /*#__PURE__*/function (_PaymentParserBase) {
  _inherits(DonationParser, _PaymentParserBase);

  var _super = _createSuper$5(DonationParser);

  function DonationParser() {
    var _this;

    _classCallCheck(this, DonationParser);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_paymentFieldTypes", new Map().set('desiredAmount', ['string', 'undefined', 'null']).set('desiredAsset', ['string', 'undefined', 'null']).set('successUrl', ['string', 'undefined', 'null']).set('cancelUrl', ['string', 'undefined', 'null']));

    return _this;
  }

  _createClass(DonationParser, [{
    key: "paymentFieldTypes",
    get: function get() {
      return this._paymentFieldTypes;
    }
  }, {
    key: "mapRawPaymentToPayment",
    value: function mapRawPaymentToPayment(rawDonation, nonIncludedFields) {
      return {
        type: PaymentType.Donation,
        desiredAmount: rawDonation.desiredAmount ? new BigNumber(rawDonation.desiredAmount) : undefined,
        desiredAsset: rawDonation.desiredAsset,
        successUrl: rawDonation.successUrl ? new URL(rawDonation.successUrl) : undefined,
        cancelUrl: rawDonation.cancelUrl ? new URL(rawDonation.cancelUrl) : undefined,
        targetAddress: nonIncludedFields.targetAddress,
        urls: nonIncludedFields.urls
      };
    }
  }]);

  return DonationParser;
}(PaymentParserBase);

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var PaymentValidatorBase = /*#__PURE__*/function () {
  function PaymentValidatorBase() {
    _classCallCheck(this, PaymentValidatorBase);
  }

  _createClass(PaymentValidatorBase, [{
    key: "validate",
    value: function validate(payment) {
      var bail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (!isPlainObject(payment)) return [this.invalidPaymentObjectError];
      var failedValidationResults = bail ? [] : undefined;

      var _iterator = _createForOfIteratorHelper$1(this.validationMethods),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var validationMethod = _step.value;
          var currentFailedValidationResults = validationMethod(payment);

          if (currentFailedValidationResults) {
            if (!bail) return currentFailedValidationResults; // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

            failedValidationResults.concat(currentFailedValidationResults);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return failedValidationResults;
    }
  }]);

  return PaymentValidatorBase;
}();

var networksInternal = {
  // mainnet: {
  //   id: 'NetXdQprcVkpaWU',
  //   name: 'mainnet',
  // },
  granadanet: {
    id: 'NetXz969SFaFn8k',
    name: 'granadanet'
  },
  edo2net: {
    id: 'NetXSgo1ZT2DRUG',
    name: 'edo2net'
  }
};
var networks = networksInternal;
var networksCollection = Object.values(networksInternal);

var tezosMeta = {
  symbol: 'XTZ',
  name: 'Tezos',
  decimals: 6,
  // eslint-disable-next-line max-len
  thumbnailUri: 'data:image/png;base64,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'
};
var tokenWhitelist = [// {
//   network: networks.mainnet,
//   type: 'fa1.2',
//   contractAddress: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
//   metadata: {
//     decimals: 18,
//     symbol: 'KUSD',
//     name: 'Kolibri',
//     thumbnailUri: 'https://kolibri-data.s3.amazonaws.com/logo.png',
//   },
// },
// {
//   network: networks.mainnet,
//   type: 'fa2',
//   contractAddress: 'KT1REEb5VxWRjcHm5GzDMwErMmNFftsE5Gpf',
//   fa2TokenId: 0,
//   metadata: {
//     decimals: 6,
//     symbol: 'USDS',
//     name: 'Stably USD',
//     thumbnailUri: 'https://quipuswap.com/tokens/stably.png',
//   },
// },
{
  network: networks.edo2net,
  type: 'fa2',
  contractAddress: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
  fa2TokenId: 0,
  metadata: {
    decimals: 0,
    symbol: 'MBRG',
    name: 'MAX BURGER',
    thumbnailUri: 'https://quipuswap.com/tokens/stably.png'
  }
}];
var tokenWhitelistMap = new Map(tokenWhitelist.map(function (token) {
  return [token.contractAddress, token];
}));

var contractAddressPrefixes = ['KT'];
var implicitAddressPrefixes = ['tz1', 'tz2', 'tz3'];
var addressPrefixes = [].concat(contractAddressPrefixes, implicitAddressPrefixes);
var tezosInfo = {
  addressLength: 36,
  contractAddressPrefixes: contractAddressPrefixes,
  implicitAddressPrefixes: implicitAddressPrefixes,
  addressPrefixes: addressPrefixes
};

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var validateTargetAddress = function validateTargetAddress(targetAddress, errors) {
  if (typeof targetAddress !== 'string') return [errors.invalidTargetAddress];
  if (targetAddress.length !== tezosInfo.addressLength) return [errors.targetAddressHasInvalidLength];
  if (!tezosInfo.addressPrefixes.some(function (prefix) {
    return targetAddress.startsWith(prefix);
  })) return [errors.targetAddressIsNotNetworkAddress];
};
var validateAmount = function validateAmount(amount, errors) {
  if (!BigNumber.isBigNumber(amount) || amount.isNaN() || !amount.isFinite()) return [errors.invalidAmount];
  if (amount.isNegative()) return [errors.amountIsNegative];
};
var validateDesiredAmount = function validateDesiredAmount(desiredAmount, errors) {
  return desiredAmount === undefined ? undefined : validateAmount(desiredAmount, errors);
};
var validateAsset = function validateAsset(asset, errors) {
  if (asset === undefined) return;
  if (typeof asset !== 'string') return [errors.invalidAsset];
  if (asset.length !== tezosInfo.addressLength) return [errors.assetHasInvalidLength];
  if (!tezosInfo.contractAddressPrefixes.some(function (prefix) {
    return asset.startsWith(prefix);
  })) return [errors.assetIsNotContractAddress];
};
var validateCreatedDate = function validateCreatedDate(date, errors) {
  if (!(date instanceof Date)) return [errors.invalidCreatedDate];
};
var validateUrl = function validateUrl(url, errors) {
  if (url === undefined) return;
  if (!(url instanceof URL)) return [errors.invalidUrl];
  if (url.protocol.indexOf('javascript') > -1) return [errors.invalidProtocol];
};
var validateExpiredDate = function validateExpiredDate(expiredDate, createdDate, minimumPaymentLifetime, errors) {
  if (expiredDate === undefined) return;
  if (!(expiredDate instanceof Date)) return [errors.invalidExpiredDate];

  if (expiredDate.getTime() - createdDate.getTime() < minimumPaymentLifetime) {
    return [errors.paymentLifetimeIsShort];
  }
};
var validateData = function validateData(data, errors) {
  if (!isPlainObject(data) || Object.keys(data).some(function (key) {
    return key !== 'public' && key !== 'private';
  })) return [errors.invalidData];
  var publicData = data["public"];
  var privateData = data["private"];
  if (!(publicData || privateData)) return [errors.invalidData];

  if (publicData !== undefined) {
    if (!isPlainObject(publicData)) return [errors.invalidPublicData];
    if (!isFlatObject(publicData)) return [errors.publicDataShouldBeFlat];
  }

  if (privateData !== undefined) {
    if (!isPlainObject(privateData)) return [errors.invalidPrivateData];
    if (!isFlatObject(privateData)) return [errors.privateDataShouldBeFlat];
  }
};

var isFlatObject = function isFlatObject(obj) {
  var _iterator = _createForOfIteratorHelper(Object.getOwnPropertyNames(obj)),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var propertyName = _step.value;
      var property = obj[propertyName];
      if (_typeof(property) === 'object' || typeof property === 'function') return false;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return true;
};

function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var PaymentValidator = /*#__PURE__*/function (_PaymentValidatorBase) {
  _inherits(PaymentValidator, _PaymentValidatorBase);

  var _super = _createSuper$4(PaymentValidator);

  function PaymentValidator() {
    var _this;

    _classCallCheck(this, PaymentValidator);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "validationMethods", [function (payment) {
      return payment.type !== PaymentType.Payment ? [PaymentValidator.errors.invalidType] : undefined;
    }, function (payment) {
      return validateTargetAddress(payment.targetAddress, PaymentValidator.errors);
    }, function (payment) {
      return validateAmount(payment.amount, PaymentValidator.errors);
    }, function (payment) {
      return validateData(payment.data, PaymentValidator.errors);
    }, function (payment) {
      return validateAsset(payment.asset, PaymentValidator.errors);
    }, function (payment) {
      return validateUrl(payment.successUrl, PaymentValidator.successUrlErrors);
    }, function (payment) {
      return validateUrl(payment.cancelUrl, PaymentValidator.cancelUrlErrors);
    }, function (payment) {
      return validateCreatedDate(payment.created, PaymentValidator.errors);
    }, function (payment) {
      return validateExpiredDate(payment.expired, payment.created, PaymentValidator.minimumPaymentLifetime, PaymentValidator.errors);
    }]);

    _defineProperty(_assertThisInitialized(_this), "invalidPaymentObjectError", PaymentValidator.errors.invalidPaymentObject);

    return _this;
  }

  return PaymentValidator;
}(PaymentValidatorBase);

_defineProperty(PaymentValidator, "errors", {
  invalidPaymentObject: 'Payment is undefined or not object',
  invalidType: 'Payment type is invalid',
  invalidAmount: 'Amount is invalid',
  amountIsNegative: 'Amount is less than zero',
  invalidTargetAddress: 'Target address is invalid',
  targetAddressIsNotNetworkAddress: 'Target address isn\'t a network address',
  targetAddressHasInvalidLength: 'Target address has an invalid address',
  invalidData: 'Payment data is invalid',
  invalidPublicData: 'Payment public data is invalid',
  invalidPrivateData: 'Payment private data is invalid',
  publicDataShouldBeFlat: 'Public data should be flat',
  privateDataShouldBeFlat: 'Private data should be flat',
  invalidAsset: 'Asset address is invalid',
  assetIsNotContractAddress: 'Asset address isn\'t a contract address',
  assetHasInvalidLength: 'Asset address has an invalid address',
  invalidSuccessUrl: 'Success URL is invalid',
  successUrlHasInvalidProtocol: 'Success URL has an invalid protocol',
  invalidCancelUrl: 'Cancel URL is invalid',
  cancelUrlHasInvalidProtocol: 'Cancel URL has an invalid protocol',
  invalidCreatedDate: 'Created date is invalid',
  invalidExpiredDate: 'Expired date is invalid',
  paymentLifetimeIsShort: 'Payment lifetime is short'
});

_defineProperty(PaymentValidator, "minimumPaymentLifetime", 600000);

_defineProperty(PaymentValidator, "successUrlErrors", {
  invalidUrl: PaymentValidator.errors.invalidSuccessUrl,
  invalidProtocol: PaymentValidator.errors.successUrlHasInvalidProtocol
});

_defineProperty(PaymentValidator, "cancelUrlErrors", {
  invalidUrl: PaymentValidator.errors.invalidCancelUrl,
  invalidProtocol: PaymentValidator.errors.cancelUrlHasInvalidProtocol
});

function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var DonationValidator = /*#__PURE__*/function (_PaymentValidatorBase) {
  _inherits(DonationValidator, _PaymentValidatorBase);

  var _super = _createSuper$3(DonationValidator);

  function DonationValidator() {
    var _this;

    _classCallCheck(this, DonationValidator);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "validationMethods", [function (donation) {
      return donation.type !== PaymentType.Donation ? [DonationValidator.errors.invalidType] : undefined;
    }, function (donation) {
      return validateTargetAddress(donation.targetAddress, DonationValidator.errors);
    }, function (donation) {
      return validateDesiredAmount(donation.desiredAmount, DonationValidator.errors);
    }, function (donation) {
      return validateAsset(donation.desiredAsset, DonationValidator.errors);
    }, function (donation) {
      return validateUrl(donation.successUrl, DonationValidator.successUrlErrors);
    }, function (donation) {
      return validateUrl(donation.cancelUrl, DonationValidator.cancelUrlErrors);
    }]);

    _defineProperty(_assertThisInitialized(_this), "invalidPaymentObjectError", DonationValidator.errors.invalidDonationObject);

    return _this;
  }

  return DonationValidator;
}(PaymentValidatorBase);

_defineProperty(DonationValidator, "errors", {
  invalidDonationObject: 'Donation is undefined or not object',
  invalidType: 'Donation type is invalid',
  invalidAmount: 'Desired amount is invalid',
  amountIsNegative: 'Desired amount is less than zero',
  invalidTargetAddress: 'Target address is invalid',
  targetAddressIsNotNetworkAddress: 'Target address isn\'t a network address',
  targetAddressHasInvalidLength: 'Target address has an invalid address',
  invalidAsset: 'Desired asset address is invalid',
  assetIsNotContractAddress: 'Desired asset address isn\'t a contract address',
  assetHasInvalidLength: 'Desired asset address has an invalid address',
  invalidSuccessUrl: 'Success URL is invalid',
  successUrlHasInvalidProtocol: 'Success URL has an invalid protocol',
  invalidCancelUrl: 'Cancel URL is invalid',
  cancelUrlHasInvalidProtocol: 'Cancel URL has an invalid protocol'
});

_defineProperty(DonationValidator, "successUrlErrors", {
  invalidUrl: DonationValidator.errors.invalidSuccessUrl,
  invalidProtocol: DonationValidator.errors.successUrlHasInvalidProtocol
});

_defineProperty(DonationValidator, "cancelUrlErrors", {
  invalidUrl: DonationValidator.errors.invalidCancelUrl,
  invalidProtocol: DonationValidator.errors.cancelUrlHasInvalidProtocol
});

var StateModel = function StateModel() {// All derived classes should be static

  _classCallCheck(this, StateModel);
};

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Payment = /*#__PURE__*/function (_StateModel) {
  _inherits(Payment, _StateModel);

  var _super = _createSuper$2(Payment);

  function Payment() {
    _classCallCheck(this, Payment);

    return _super.apply(this, arguments);
  }

  _createClass(Payment, null, [{
    key: "validate",
    value: function validate(payment) {
      return this.defaultValidator.validate(payment);
    }
  }, {
    key: "parse",
    value: function parse(payment64, nonIncludedFields) {
      var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Payment.defaultParser;
      return parser.parse(payment64, nonIncludedFields);
    }
  }, {
    key: "publicDataExists",
    value: function publicDataExists(paymentOrPaymentDataOrPaymentData) {
      return this.publicDataExistsInternal(paymentOrPaymentDataOrPaymentData);
    }
  }, {
    key: "privateDataExists",
    value: function privateDataExists(payment) {
      return !!payment.data["private"];
    }
  }, {
    key: "publicDataExistsInternal",
    value: function publicDataExistsInternal(paymentOrPaymentDataOrPaymentData) {
      return !!(Payment.isPayment(paymentOrPaymentDataOrPaymentData) ? paymentOrPaymentDataOrPaymentData.data["public"] : paymentOrPaymentDataOrPaymentData["public"]);
    }
  }, {
    key: "isPayment",
    value: function isPayment(paymentOrPaymentDataOrPaymentData) {
      return !!paymentOrPaymentDataOrPaymentData.amount;
    }
  }]);

  return Payment;
}(StateModel);

_defineProperty(Payment, "defaultParser", new PaymentParser());

_defineProperty(Payment, "defaultValidator", new PaymentValidator());

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Donation = /*#__PURE__*/function (_StateModel) {
  _inherits(Donation, _StateModel);

  var _super = _createSuper$1(Donation);

  function Donation() {
    _classCallCheck(this, Donation);

    return _super.apply(this, arguments);
  }

  _createClass(Donation, null, [{
    key: "validate",
    value: function validate(donation) {
      return this.defaultValidator.validate(donation);
    }
  }, {
    key: "parse",
    value: function parse(donationBase64, nonIncludedFields) {
      var parser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Donation.defaultParser;
      return parser.parse(donationBase64, nonIncludedFields);
    }
  }]);

  return Donation;
}(StateModel);

_defineProperty(Donation, "defaultParser", new DonationParser());

_defineProperty(Donation, "defaultValidator", new DonationValidator());

var getParameterizedRoute = function getParameterizedRoute(factory, template) {
  factory.template = template;
  return factory;
};

var ServiceOperationType;

(function (ServiceOperationType) {
  ServiceOperationType[ServiceOperationType["Payment"] = 1] = "Payment";
  ServiceOperationType[ServiceOperationType["Donation"] = 2] = "Donation";
  ServiceOperationType[ServiceOperationType["All"] = 3] = "All";
})(ServiceOperationType || (ServiceOperationType = {}));

var emptyService = {
  name: '',
  description: '',
  links: [],
  version: 0,
  metadata: '',
  contractAddress: '',
  allowedTokens: {
    tez: true,
    assets: []
  },
  allowedOperationType: ServiceOperationType.Payment,
  owner: '',
  paused: false,
  deleted: false,
  network: networks.edo2net
};

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ServiceOperation = /*#__PURE__*/function (_StateModel) {
  _inherits(ServiceOperation, _StateModel);

  var _super = _createSuper(ServiceOperation);

  function ServiceOperation() {
    _classCallCheck(this, ServiceOperation);

    return _super.apply(this, arguments);
  }

  _createClass(ServiceOperation, null, [{
    key: "publicPayloadExists",
    value: function publicPayloadExists(operation) {
      return !!operation.payload["public"];
    }
  }, {
    key: "privatePayloadExists",
    value: function privatePayloadExists(operation) {
      return !!operation.payload["private"];
    }
  }, {
    key: "isPayloadDecoded",
    value: function isPayloadDecoded(data) {
      return !!data.value;
    }
  }, {
    key: "parseServiceOperationPayload",
    value: function parseServiceOperationPayload(encodedValue) {
      var valueString = bytesToString(encodedValue);
      var value = null;

      try {
        value = JSON.parse(valueString);
      } catch (_unused) {
        /**/
      }

      return {
        value: value,
        valueString: valueString,
        encodedValue: encodedValue
      };
    }
  }]);

  return ServiceOperation;
}(StateModel);

var ServiceOperationDirection;

(function (ServiceOperationDirection) {
  ServiceOperationDirection[ServiceOperationDirection["Incoming"] = 0] = "Incoming";
  ServiceOperationDirection[ServiceOperationDirection["Outgoing"] = 1] = "Outgoing";
})(ServiceOperationDirection || (ServiceOperationDirection = {}));

var ServiceOperationStatus;

(function (ServiceOperationStatus) {
  ServiceOperationStatus[ServiceOperationStatus["Pending"] = 0] = "Pending";
  ServiceOperationStatus[ServiceOperationStatus["Success"] = 1] = "Success";
  ServiceOperationStatus[ServiceOperationStatus["Cancelled"] = 2] = "Cancelled";
})(ServiceOperationStatus || (ServiceOperationStatus = {}));

export { Donation, DonationParser, DonationValidator, IconId, Payment, PaymentParser, PaymentType, PaymentValidator, ServiceLinkHelper, ServiceOperation, ServiceOperationDirection, ServiceOperationStatus, ServiceOperationType, StateModel, converters, emptyService, getParameterizedRoute, guards, memoize, networks, networksCollection, optimization, shallowEqual, text, tezosInfo, tezosMeta, tokenWhitelist, tokenWhitelistMap, wait };
//# sourceMappingURL=index.es5.mjs.map
