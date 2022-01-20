'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var clsx = require('clsx');
var buffer = require('buffer');
var BigNumber = require('bignumber.js');
var isPlainObjectLodashFunction = require('lodash.isplainobject');
var _typeof = require('@babel/runtime/helpers/typeof');
var _assertThisInitialized = require('@babel/runtime/helpers/assertThisInitialized');
var _inherits = require('@babel/runtime/helpers/inherits');
var _possibleConstructorReturn = require('@babel/runtime/helpers/possibleConstructorReturn');
var _getPrototypeOf = require('@babel/runtime/helpers/getPrototypeOf');
var url = require('url');
var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var michelCodec = require('@taquito/michel-codec');
var _asyncToGenerator = require('@babel/runtime/helpers/asyncToGenerator');
var _regeneratorRuntime = require('@babel/runtime/regenerator');
var utils = require('@taquito/utils');
var sodium = require('libsodium-wrappers');
var elliptic = require('elliptic');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var clsx__default = /*#__PURE__*/_interopDefaultLegacy(clsx);
var BigNumber__default = /*#__PURE__*/_interopDefaultLegacy(BigNumber);
var isPlainObjectLodashFunction__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObjectLodashFunction);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var _assertThisInitialized__default = /*#__PURE__*/_interopDefaultLegacy(_assertThisInitialized);
var _inherits__default = /*#__PURE__*/_interopDefaultLegacy(_inherits);
var _possibleConstructorReturn__default = /*#__PURE__*/_interopDefaultLegacy(_possibleConstructorReturn);
var _getPrototypeOf__default = /*#__PURE__*/_interopDefaultLegacy(_getPrototypeOf);
var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var _slicedToArray__default = /*#__PURE__*/_interopDefaultLegacy(_slicedToArray);
var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var sodium__default = /*#__PURE__*/_interopDefaultLegacy(sodium);

var isBase64UrlFormatSupported = buffer.Buffer.isEncoding('base64url');
var decode = function decode(base64String) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base64';
  if (format !== 'base64' && format !== 'base64url') return '';

  if (!isBase64UrlFormatSupported) {
    format = 'base64';
    base64String = base64UrlPreprocessor.prepareValueForDecoding(base64String);
  }

  return buffer.Buffer.from(base64String, format).toString('utf8');
};
var encode = function encode(value) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base64';
  if (format !== 'base64' && format !== 'base64url') return '';
  if (isBase64UrlFormatSupported) return buffer.Buffer.from(value, 'utf8').toString(format);
  var encodedValue = buffer.Buffer.from(value, 'utf8').toString('base64');
  return base64UrlPreprocessor.prepareEncodedValue(encodedValue);
};
var base64UrlPreprocessor = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  prepareEncodedValue: function prepareEncodedValue(base64value) {
    return base64value.split('=')[0].replace(/\+/g, '-').replace(/\//g, '_');
  },
  prepareValueForDecoding: function prepareValueForDecoding(base64value) {
    base64value = base64value.replace(/-/g, '+').replace(/_/g, '/');

    switch (base64value.length % 4) {
      case 0:
        return base64value;

      case 2:
        return base64value + '==';

      case 3:
        return base64value + '=';

      default:
        throw new Error('Invalid base64url value');
    }
  }
};

var base64 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  decode: decode,
  encode: encode
});

var stringToUint8Array = function stringToUint8Array(hex) {
  var _hex$match;

  var integers = (_hex$match = hex.match(/[\da-f]{2}/gi)) === null || _hex$match === void 0 ? void 0 : _hex$match.map(function (val) {
    return parseInt(val, 16);
  }); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

  return new Uint8Array(integers);
};
var stringToBytes = function stringToBytes(value) {
  return buffer.Buffer.from(value, 'utf8').toString('hex');
};
var bytesToString = function bytesToString(value) {
  return buffer.Buffer.from(stringToUint8Array(value)).toString('utf8');
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
var tokensAmountToNat = function tokensAmountToNat(tokensAmount, decimals) {
  return new BigNumber__default["default"](tokensAmount).multipliedBy(Math.pow(10, decimals)).integerValue();
};
var numberToTokensAmount = function numberToTokensAmount(value, decimals) {
  return new BigNumber__default["default"](value).integerValue().div(Math.pow(10, decimals));
};
var tezToMutez = function tezToMutez(tez) {
  return tokensAmountToNat(tez, 6);
};
var mutezToTez = function mutezToTez(mutez) {
  return numberToTokensAmount(mutez, 6);
};

var converters = /*#__PURE__*/Object.freeze({
  __proto__: null,
  stringToUint8Array: stringToUint8Array,
  stringToBytes: stringToBytes,
  bytesToString: bytesToString,
  objectToBytes: objectToBytes,
  bytesToObject: bytesToObject,
  tokensAmountToNat: tokensAmountToNat,
  numberToTokensAmount: numberToTokensAmount,
  tezToMutez: tezToMutez,
  mutezToTez: mutezToTez
});

var isArray = function isArray(arg) {
  return Array.isArray(arg);
};
var isReadonlyArray = function isReadonlyArray(arg) {
  return Array.isArray(arg);
};
var isPlainObject = function isPlainObject(value) {
  return isPlainObjectLodashFunction__default["default"](value);
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
var zeroBigNumber = new BigNumber__default["default"](0);
var optimization = {
  emptyArray: emptyArray,
  emptyMap: emptyMap,
  emptySet: emptySet,
  emptyObject: emptyObject,
  zeroBigNumber: zeroBigNumber
};

var is = function is(x, y) {
  return x === y ? x !== 0 || y !== 0 || 1 / x === 1 / y // eslint-disable-next-line no-self-compare
  : x !== x && y !== y;
};

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;
  if (_typeof__default["default"](objA) !== 'object' || objA === null || _typeof__default["default"](objB) !== 'object' || objB === null) return false;
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

var stringPad = function stringPad(string, isStart, maxLength) {
  var fillString = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ' ';
  if (String.prototype.padStart !== undefined) return string.padStart(maxLength, fillString);
  var stringLength = string.length; // eslint-disable-next-line eqeqeq

  if (maxLength <= stringLength || fillString == '') return string;
  var fillLength = maxLength - stringLength;
  var filler = fillString.repeat(Math.ceil(fillLength / fillString.length));
  if (filler.length > fillLength) filler = filler.slice(0, fillLength);
  return isStart ? filler + string : string + filler;
};

var padStart = function padStart(string, maxLength) {
  var fillString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';
  return String.prototype.padStart !== undefined ? string.padStart(maxLength, fillString) : stringPad(string, true, maxLength, fillString);
};
var padEnd = function padEnd(string, maxLength) {
  var fillString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';
  return String.prototype.padEnd !== undefined ? string.padEnd(maxLength, fillString) : stringPad(string, false, maxLength, fillString);
};

var text = /*#__PURE__*/Object.freeze({
  __proto__: null,
  capitalize: capitalize,
  getAvatarText: getAvatarText,
  padStart: padStart,
  padEnd: padEnd
});

var wait = function wait(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};

function _createForOfIteratorHelper$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
exports.IconId = void 0;

(function (IconId) {
  IconId[IconId["Common"] = 0] = "Common";
  IconId[IconId["Email"] = 1] = "Email";
  IconId[IconId["Telegram"] = 2] = "Telegram";
  IconId[IconId["Facebook"] = 3] = "Facebook";
  IconId[IconId["Twitter"] = 4] = "Twitter";
  IconId[IconId["Instagram"] = 5] = "Instagram";
  IconId[IconId["GitHub"] = 6] = "GitHub";
  IconId[IconId["Reddit"] = 7] = "Reddit";
})(exports.IconId || (exports.IconId = {}));

var getInvalidLinkInfo = function getInvalidLinkInfo(link) {
  return {
    rawLink: link,
    formattedLink: '#',
    displayLink: 'Invalid Link',
    icon: exports.IconId.Common
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
  if (formattedLink === baseUrl) return false;
  return {
    rawLink: link,
    formattedLink: formattedLink,
    displayLink: prepareDisplayLink(link).replace(baseUrl, ''),
    icon: icon
  };
};

var telegramLinkInfoProvider = function telegramLinkInfoProvider(link) {
  return socialMediaLinkInfoProvider(link, 'https://t.me/', exports.IconId.Telegram);
};

var facebookLinkInfoProvider = function facebookLinkInfoProvider(link) {
  return socialMediaLinkInfoProvider(link, 'https://facebook.com/', exports.IconId.Facebook);
};

var twitterLinkInfoProvider = function twitterLinkInfoProvider(link) {
  return socialMediaLinkInfoProvider(link, 'https://twitter.com/', exports.IconId.Twitter);
};

var instagramLinkInfoProvider = function instagramLinkInfoProvider(link) {
  return socialMediaLinkInfoProvider(link, 'https://instagram.com/', exports.IconId.Instagram);
};

var gitHubLinkInfoProvider = function gitHubLinkInfoProvider(link) {
  return socialMediaLinkInfoProvider(link, 'https://github.com/', exports.IconId.GitHub);
};

var redditLinkInfoProvider = function redditLinkInfoProvider(link) {
  return socialMediaLinkInfoProvider(link, 'https://www.reddit.com/', exports.IconId.Reddit);
}; // This regex should not use for email validation


var emailCheckingRegEx = /^[^\s/@]+@[^\s@/]+$/;

var emailLinkInfoProvider = function emailLinkInfoProvider(link) {
  var preparedFormattedLink = prepareFormattedLink(link);
  return emailCheckingRegEx.test(preparedFormattedLink) && {
    rawLink: link,
    formattedLink: "mailto:".concat(preparedFormattedLink),
    displayLink: prepareDisplayLink(link),
    icon: exports.IconId.Email
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
    icon: exports.IconId.Common
  };
};

var editLinkInfoProvider = function editLinkInfoProvider(link) {
  var formattedLink = prepareFormattedLink(link);
  return {
    rawLink: link,
    formattedLink: formattedLink,
    displayLink: prepareDisplayLink(link),
    icon: exports.IconId.Common
  };
};

var ServiceLinkHelper = /*#__PURE__*/function () {
  function ServiceLinkHelper() {
    _classCallCheck__default["default"](this, ServiceLinkHelper);
  }

  _createClass__default["default"](ServiceLinkHelper, [{
    key: "getLinkInfo",
    value: // Order is important
    function getLinkInfo(link) {
      var isEditMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var _iterator = _createForOfIteratorHelper$2(ServiceLinkHelper.linkInfoProviders),
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

_defineProperty__default["default"](ServiceLinkHelper, "linkInfoProviders", [// Disallowed
javascriptLinkInfoProvider, // Allowed
telegramLinkInfoProvider, facebookLinkInfoProvider, twitterLinkInfoProvider, instagramLinkInfoProvider, gitHubLinkInfoProvider, emailLinkInfoProvider, redditLinkInfoProvider, commonLinkInfoProvider]);

exports.PaymentType = void 0;

(function (PaymentType) {
  PaymentType[PaymentType["Payment"] = 1] = "Payment";
  PaymentType[PaymentType["Donation"] = 2] = "Donation";
})(exports.PaymentType || (exports.PaymentType = {}));

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var PaymentValidatorBase = /*#__PURE__*/function () {
  function PaymentValidatorBase() {
    _classCallCheck__default["default"](this, PaymentValidatorBase);
  }

  _createClass__default["default"](PaymentValidatorBase, [{
    key: "validate",
    value: function validate(payment) {
      var bail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (!isPlainObject(payment)) return [this.invalidPaymentObjectError];
      var failedValidationResults;

      var _iterator = _createForOfIteratorHelper$1(this.validationMethods),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var validationMethod = _step.value;
          var currentFailedValidationResults = validationMethod(payment);

          if (currentFailedValidationResults) {
            if (!bail) return currentFailedValidationResults;
            failedValidationResults = (failedValidationResults || []).concat(currentFailedValidationResults);
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
  mainnet: {
    id: 'NetXdQprcVkpaWU',
    name: 'mainnet'
  },
  hangzhounet: {
    id: 'NetXZSsxBpMQeAT',
    name: 'hangzhounet'
  }
};
var networks = networksInternal;
var networksCollection = Object.values(networksInternal);
var networkIdRegExp = /^[a-zA-Z]\w*$/;
var networkNameRegExp = networkIdRegExp;

var tezosMeta = {
  symbol: 'XTZ',
  name: 'Tezos',
  decimals: 6,
  thumbnailUri: 'https://dashboard.tezospayments.com/tokens/tezos.png'
};
var unknownAssetMeta = {
  name: 'Unknown',
  symbol: 'Unknown',
  decimals: 0,
  thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png'
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
  network: networks.hangzhounet,
  type: 'fa1.2',
  contractAddress: 'KT19sYK89XKYTeGHekWK9wL5iDHVF4YYf26t',
  metadata: {
    decimals: 6,
    symbol: 'FA12',
    name: 'Test FA 1.2',
    thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png'
  }
}, {
  network: networks.hangzhounet,
  type: 'fa2',
  contractAddress: 'KT1EKo1Eihucz9N4cQyaDKeYRoMzTEoiZRAT',
  id: 0,
  metadata: {
    decimals: 6,
    symbol: 'FA20',
    name: 'Test FA 2.0',
    thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png'
  }
}];
var tokenWhitelistMap = new Map(networksCollection.map(function (nc) {
  return [nc, new Map(tokenWhitelist.filter(function (t) {
    return t.network === nc;
  }).map(function (t) {
    return [t.contractAddress, t];
  }))];
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

exports.KeyType = void 0;

(function (KeyType) {
  KeyType["Ed25519"] = "Ed25519";
  KeyType["Secp256k1"] = "Secp256k1";
  KeyType["P256"] = "P256";
})(exports.KeyType || (exports.KeyType = {}));

/* eslint-disable @typescript-eslint/no-redeclare */
var URL = url.URL || globalThis.URL;

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  URL: URL
});

var validateTargetAddress = function validateTargetAddress(targetAddress, errors) {
  if (typeof targetAddress !== 'string') return [errors.invalidTargetAddress];
  if (targetAddress.length !== tezosInfo.addressLength) return [errors.targetAddressHasInvalidLength];
  if (!tezosInfo.addressPrefixes.some(function (prefix) {
    return targetAddress.startsWith(prefix);
  })) return [errors.targetAddressIsNotNetworkAddress];
};
var validateId = function validateId(id, errors) {
  if (typeof id !== 'string') return [errors.invalidId];
  if (id === '') return [errors.emptyId];
};
var validateAmount = function validateAmount(amount, errors) {
  if (!BigNumber__default["default"].isBigNumber(amount) || amount.isNaN() || !amount.isFinite()) return [errors.invalidAmount];
  if (amount.isZero() || amount.isNegative()) return [errors.amountIsNonPositive];
};
var validateDesiredAmount = function validateDesiredAmount(desiredAmount, errors) {
  return desiredAmount === undefined ? undefined : validateAmount(desiredAmount, errors);
};
var validatePaymentAsset = function validatePaymentAsset(asset, errors) {
  if (asset === undefined) return;
  if (!isPlainObject(asset)) return [errors.invalidAsset];
  return validateAsset(asset, errors) || validateAssetDecimals(asset.decimals, errors);
};
var validateDonationAsset = function validateDonationAsset(asset, errors) {
  if (asset === undefined) return;
  if (!isPlainObject(asset)) return [errors.invalidAsset];
  return validateAsset(asset, errors);
};
var validateCreatedDate = function validateCreatedDate(date, errors) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return [errors.invalidCreatedDate];
};
var validateUrl = function validateUrl(url, errors) {
  if (url === undefined) return;
  if (!(url instanceof URL)) return [errors.invalidUrl];
  if (url.protocol.indexOf('javascript') > -1) return [errors.invalidProtocol];
};
var validateExpiredDate = function validateExpiredDate(expiredDate, createdDate, minimumPaymentLifetime, errors) {
  if (expiredDate === undefined) return;
  if (!(expiredDate instanceof Date) || isNaN(expiredDate.getTime())) return [errors.invalidExpiredDate];

  if (expiredDate.getTime() - createdDate.getTime() < minimumPaymentLifetime) {
    return [errors.paymentLifetimeIsShort];
  }
};
var validateData = function validateData(data, errors) {
  if (data === undefined) return;
  if (!isPlainObject(data)) return [errors.invalidData];
};

var validateAsset = function validateAsset(asset, errors) {
  return validateAssetAddress(asset.address, errors) || validateAssetId(asset.id, errors);
};

var validateAssetAddress = function validateAssetAddress(assetAddress, errors) {
  if (typeof assetAddress !== 'string') return [errors.invalidAssetAddress];
  if (assetAddress.length !== tezosInfo.addressLength) return [errors.assetAddressHasInvalidLength];
  if (!tezosInfo.contractAddressPrefixes.some(function (prefix) {
    return assetAddress.startsWith(prefix);
  })) return [errors.assetAddressIsNotContractAddress];
};

var validateAssetId = function validateAssetId(assetId, errors) {
  if (assetId === null) return;
  if (typeof assetId !== 'number' || Number.isNaN(assetId) || !Number.isFinite(assetId)) return [errors.invalidAssetId];
  if (assetId < 0) return [errors.assetIdIsNegative];
  if (!Number.isInteger(assetId)) return [errors.assetIdIsNotInteger];
};

var validateAssetDecimals = function validateAssetDecimals(assetDecimals, errors) {
  if (typeof assetDecimals !== 'number' || Number.isNaN(assetDecimals) || !Number.isFinite(assetDecimals)) return [errors.invalidAssetDecimals];
  if (assetDecimals < 0) return [errors.assetDecimalsNumberIsNegative];
  if (!Number.isInteger(assetDecimals)) return [errors.assetDecimalsNumberIsNotInteger];
};

function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = _getPrototypeOf__default["default"](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default["default"](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default["default"](this, result); }; }

function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var PaymentValidator = /*#__PURE__*/function (_PaymentValidatorBase) {
  _inherits__default["default"](PaymentValidator, _PaymentValidatorBase);

  var _super = _createSuper$4(PaymentValidator);

  function PaymentValidator() {
    var _this;

    _classCallCheck__default["default"](this, PaymentValidator);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty__default["default"](_assertThisInitialized__default["default"](_this), "validationMethods", [function (payment) {
      return payment.type !== exports.PaymentType.Payment ? [PaymentValidator.errors.invalidType] : undefined;
    }, function (payment) {
      return validateTargetAddress(payment.targetAddress, PaymentValidator.errors);
    }, function (payment) {
      return validateId(payment.id, PaymentValidator.errors);
    }, function (payment) {
      return validateAmount(payment.amount, PaymentValidator.errors);
    }, function (payment) {
      return validatePaymentAsset(payment.asset, PaymentValidator.errors);
    }, function (payment) {
      return validateData(payment.data, PaymentValidator.errors);
    }, function (payment) {
      return validateUrl(payment.successUrl, PaymentValidator.successUrlErrors);
    }, function (payment) {
      return validateUrl(payment.cancelUrl, PaymentValidator.cancelUrlErrors);
    }, function (payment) {
      return validateCreatedDate(payment.created, PaymentValidator.errors);
    }, function (payment) {
      return validateExpiredDate(payment.expired, payment.created, PaymentValidator.minimumPaymentLifetime, PaymentValidator.errors);
    }]);

    _defineProperty__default["default"](_assertThisInitialized__default["default"](_this), "invalidPaymentObjectError", PaymentValidator.errors.invalidPaymentObject);

    return _this;
  }

  return _createClass__default["default"](PaymentValidator);
}(PaymentValidatorBase);

_defineProperty__default["default"](PaymentValidator, "errors", {
  invalidPaymentObject: 'Payment is undefined or not object',
  invalidType: 'Payment type is invalid',
  invalidTargetAddress: 'Target address is invalid',
  targetAddressIsNotNetworkAddress: 'Target address isn\'t a network address',
  targetAddressHasInvalidLength: 'Target address has an invalid address',
  invalidId: 'Id is invalid',
  emptyId: 'Id is empty',
  invalidAmount: 'Amount is invalid',
  amountIsNonPositive: 'Amount is less than or equal to zero',
  invalidData: 'Payment data is invalid',
  invalidAsset: 'Asset is invalid',
  invalidAssetAddress: 'Asset address is invalid',
  assetAddressIsNotContractAddress: 'Asset address isn\'t a contract address',
  assetAddressHasInvalidLength: 'Asset address has an invalid address',
  invalidAssetId: 'Asset Id is invalid',
  assetIdIsNegative: 'Asset Id is negative',
  assetIdIsNotInteger: 'Asset Id isn\'t an integer',
  invalidAssetDecimals: 'Asset number of decimals is invalid',
  assetDecimalsNumberIsNegative: 'Asset number of decimals is negative',
  assetDecimalsNumberIsNotInteger: 'Asset number of decimals isn\'t an integer',
  invalidSuccessUrl: 'Success URL is invalid',
  successUrlHasInvalidProtocol: 'Success URL has an invalid protocol',
  invalidCancelUrl: 'Cancel URL is invalid',
  cancelUrlHasInvalidProtocol: 'Cancel URL has an invalid protocol',
  invalidCreatedDate: 'Created date is invalid',
  invalidExpiredDate: 'Expired date is invalid',
  paymentLifetimeIsShort: 'Payment lifetime is short'
});

_defineProperty__default["default"](PaymentValidator, "minimumPaymentLifetime", 600000);

_defineProperty__default["default"](PaymentValidator, "successUrlErrors", {
  invalidUrl: PaymentValidator.errors.invalidSuccessUrl,
  invalidProtocol: PaymentValidator.errors.successUrlHasInvalidProtocol
});

_defineProperty__default["default"](PaymentValidator, "cancelUrlErrors", {
  invalidUrl: PaymentValidator.errors.invalidCancelUrl,
  invalidProtocol: PaymentValidator.errors.cancelUrlHasInvalidProtocol
});

function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf__default["default"](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default["default"](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default["default"](this, result); }; }

function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var DonationValidator = /*#__PURE__*/function (_PaymentValidatorBase) {
  _inherits__default["default"](DonationValidator, _PaymentValidatorBase);

  var _super = _createSuper$3(DonationValidator);

  function DonationValidator() {
    var _this;

    _classCallCheck__default["default"](this, DonationValidator);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty__default["default"](_assertThisInitialized__default["default"](_this), "validationMethods", [function (donation) {
      return donation.type !== exports.PaymentType.Donation ? [DonationValidator.errors.invalidType] : undefined;
    }, function (donation) {
      return validateData(donation.data, DonationValidator.errors);
    }, function (donation) {
      return validateTargetAddress(donation.targetAddress, DonationValidator.errors);
    }, function (donation) {
      return validateDesiredAmount(donation.desiredAmount, DonationValidator.errors);
    }, function (donation) {
      return validateDonationAsset(donation.desiredAsset, DonationValidator.errors);
    }, function (donation) {
      return validateUrl(donation.successUrl, DonationValidator.successUrlErrors);
    }, function (donation) {
      return validateUrl(donation.cancelUrl, DonationValidator.cancelUrlErrors);
    }]);

    _defineProperty__default["default"](_assertThisInitialized__default["default"](_this), "invalidPaymentObjectError", DonationValidator.errors.invalidDonationObject);

    return _this;
  }

  return _createClass__default["default"](DonationValidator);
}(PaymentValidatorBase);

_defineProperty__default["default"](DonationValidator, "errors", {
  invalidDonationObject: 'Donation is undefined or not object',
  invalidType: 'Donation type is invalid',
  invalidData: 'Donation data is invalid',
  invalidAmount: 'Desired amount is invalid',
  amountIsNonPositive: 'Desired amount is less than or equal to zero',
  invalidTargetAddress: 'Target address is invalid',
  targetAddressIsNotNetworkAddress: 'Target address isn\'t a network address',
  targetAddressHasInvalidLength: 'Target address has an invalid address',
  invalidAsset: 'Desired asset is invalid',
  invalidAssetAddress: 'Desired asset address is invalid',
  assetAddressIsNotContractAddress: 'Desired asset address isn\'t a contract address',
  assetAddressHasInvalidLength: 'Desired asset address has an invalid address',
  invalidAssetId: 'Asset Id is invalid',
  assetIdIsNegative: 'Asset Id is negative',
  assetIdIsNotInteger: 'Asset Id isn\'t an integer',
  invalidSuccessUrl: 'Success URL is invalid',
  successUrlHasInvalidProtocol: 'Success URL has an invalid protocol',
  invalidCancelUrl: 'Cancel URL is invalid',
  cancelUrlHasInvalidProtocol: 'Cancel URL has an invalid protocol'
});

_defineProperty__default["default"](DonationValidator, "successUrlErrors", {
  invalidUrl: DonationValidator.errors.invalidSuccessUrl,
  invalidProtocol: DonationValidator.errors.successUrlHasInvalidProtocol
});

_defineProperty__default["default"](DonationValidator, "cancelUrlErrors", {
  invalidUrl: DonationValidator.errors.invalidCancelUrl,
  invalidProtocol: DonationValidator.errors.cancelUrlHasInvalidProtocol
});

var StateModel = /*#__PURE__*/_createClass__default["default"](function StateModel() {// All derived classes should be static

  _classCallCheck__default["default"](this, StateModel);
});

var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter() {
    _classCallCheck__default["default"](this, EventEmitter);

    _defineProperty__default["default"](this, "listeners", new Set());
  }

  _createClass__default["default"](EventEmitter, [{
    key: "addListener",
    value: function addListener(listener) {
      this.listeners.add(listener);
      return this;
    }
  }, {
    key: "removeListener",
    value: function removeListener(listener) {
      if (this.listeners.has(listener)) this.listeners["delete"](listener);
      return this;
    }
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners() {
      this.listeners = new Set();
      return this;
    }
  }, {
    key: "emit",
    value: function emit() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (!this.listeners.size) return;

      if (this.listeners.size === 1) {
        var _this$listeners$value;

        (_this$listeners$value = this.listeners.values().next()).value.apply(_this$listeners$value, args);
      } else {
        // We copy listeners to prevent an unbounded loop if there is the adding of a new event handler inside the handler; 
        _toConsumableArray__default["default"](this.listeners).forEach(function (listener) {
          return listener.apply(void 0, args);
        });
      }
    }
  }]);

  return EventEmitter;
}();

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ObjectSerializationValidator = /*#__PURE__*/function () {
  function ObjectSerializationValidator(objectFieldTypes) {
    _classCallCheck__default["default"](this, ObjectSerializationValidator);

    this.objectFieldTypes = objectFieldTypes;
  }

  _createClass__default["default"](ObjectSerializationValidator, [{
    key: "minObjectFieldsCount",
    get: function get() {
      if (!this._minObjectFieldsCount) {
        var count = 0;

        var _iterator = _createForOfIteratorHelper(this.objectFieldTypes),
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

        this._minObjectFieldsCount = count;
      }

      return this._minObjectFieldsCount;
    }
  }, {
    key: "maxObjectFieldsCount",
    get: function get() {
      return this.objectFieldTypes.size;
    }
  }, {
    key: "validate",
    value: function validate(value) {
      if (!value) return false;
      var fieldNames = Object.getOwnPropertyNames(value); // Prevent the field checking if the deserializedValue has an invalid number of fields

      if (fieldNames.length < this.minObjectFieldsCount || fieldNames.length > this.maxObjectFieldsCount) return false;

      var _iterator2 = _createForOfIteratorHelper(this.objectFieldTypes),
          _step2;

      try {
        var _loop = function _loop() {
          var _step2$value = _slicedToArray__default["default"](_step2.value, 2),
              fieldName = _step2$value[0],
              expectedFieldType = _step2$value[1];

          var fieldValue = value[fieldName];
          var actualFieldType = fieldValue === null ? 'null' : _typeof__default["default"](fieldValue);

          if (Array.isArray(expectedFieldType) ? !expectedFieldType.some(function (expectedType) {
            return actualFieldType === expectedType;
          }) : actualFieldType !== expectedFieldType) {
            return {
              v: false
            };
          }
        };

        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _ret = _loop();

          if (_typeof__default["default"](_ret) === "object") return _ret.v;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return true;
    }
  }]);

  return ObjectSerializationValidator;
}();

var Base64Serializer = /*#__PURE__*/function () {
  function Base64Serializer(fieldTypes) {
    _classCallCheck__default["default"](this, Base64Serializer);

    this.objectSerializationValidator = new ObjectSerializationValidator(fieldTypes);
  }

  _createClass__default["default"](Base64Serializer, [{
    key: "serialize",
    value: function serialize(value) {
      try {
        if (!this.objectSerializationValidator.validate(value)) return null;
        var jsonString = JSON.stringify(value);
        return encode(jsonString, 'base64url');
      } catch (_unused) {
        return null;
      }
    }
  }]);

  return Base64Serializer;
}();

var Base64Deserializer = /*#__PURE__*/function () {
  function Base64Deserializer(fieldTypes) {
    _classCallCheck__default["default"](this, Base64Deserializer);

    this.objectSerializationValidator = new ObjectSerializationValidator(fieldTypes);
  }

  _createClass__default["default"](Base64Deserializer, [{
    key: "deserialize",
    value: function deserialize(serializedValue) {
      try {
        var value;

        if (serializedValue) {
          var serializedValueString = decode(serializedValue, 'base64url');
          value = JSON.parse(serializedValueString);
        } else value = {};

        return this.objectSerializationValidator.validate(value) ? value : null;
      } catch (_unused) {
        return null;
      }
    }
  }]);

  return Base64Deserializer;
}();

new Map() // address
.set('a', 'string') // decimals
.set('d', 'number') // id
.set('i', ['number', 'undefined', 'null']);

new Map() // contract
.set('c', 'string') // client
.set('cl', ['string', 'undefined', 'null']) // signature.signingPublicKey
.set('k', 'string');

var serializedPaymentFieldTypes = new Map() // id
.set('i', 'string') // amount
.set('a', 'string') // target
.set('t', 'string') // asset
.set('as', ['object', 'undefined', 'null']) // .set('as', serializedPaymentAssetFieldTypes)
// data
.set('d', ['object', 'undefined', 'null']) // successUrl
.set('su', ['string', 'undefined', 'null']) // cancelUrl
.set('cu', ['string', 'undefined', 'null']) // created
.set('c', 'number') // expired
.set('e', ['number', 'undefined', 'null']) // signature
.set('s', 'object'); // .set('s', serializedPaymentSignatureFieldTypes);

var PaymentSerializer = /*#__PURE__*/function () {
  function PaymentSerializer() {
    _classCallCheck__default["default"](this, PaymentSerializer);
  }

  _createClass__default["default"](PaymentSerializer, [{
    key: "serialize",
    value: function serialize(payment) {
      try {
        var serializedPayment = this.mapPaymentToSerializedPayment(payment);
        return PaymentSerializer.serializedPaymentBase64Serializer.serialize(serializedPayment);
      } catch (_unused) {
        return null;
      }
    }
  }, {
    key: "mapPaymentToSerializedPayment",
    value: function mapPaymentToSerializedPayment(payment) {
      var _payment$successUrl, _payment$cancelUrl, _payment$expired;

      return {
        i: payment.id,
        a: payment.amount.toString(10),
        t: payment.targetAddress,
        as: payment.asset ? this.mapPaymentAssetToSerializedPaymentAsset(payment.asset) : undefined,
        d: payment.data,
        su: (_payment$successUrl = payment.successUrl) === null || _payment$successUrl === void 0 ? void 0 : _payment$successUrl.toString(),
        cu: (_payment$cancelUrl = payment.cancelUrl) === null || _payment$cancelUrl === void 0 ? void 0 : _payment$cancelUrl.toString(),
        c: payment.created.getTime(),
        e: (_payment$expired = payment.expired) === null || _payment$expired === void 0 ? void 0 : _payment$expired.getTime(),
        s: this.mapPaymentSignatureToSerializedPaymentSignature(payment.signature)
      };
    }
  }, {
    key: "mapPaymentAssetToSerializedPaymentAsset",
    value: function mapPaymentAssetToSerializedPaymentAsset(paymentAsset) {
      return {
        a: paymentAsset.address,
        d: paymentAsset.decimals,
        i: paymentAsset.id !== null ? paymentAsset.id : undefined
      };
    }
  }, {
    key: "mapPaymentSignatureToSerializedPaymentSignature",
    value: function mapPaymentSignatureToSerializedPaymentSignature(paymentSignature) {
      return {
        k: paymentSignature.signingPublicKey,
        c: paymentSignature.contract,
        cl: paymentSignature.client
      };
    }
  }]);

  return PaymentSerializer;
}();

_defineProperty__default["default"](PaymentSerializer, "serializedPaymentBase64Serializer", new Base64Serializer(serializedPaymentFieldTypes));

var PaymentDeserializer = /*#__PURE__*/function () {
  function PaymentDeserializer() {
    _classCallCheck__default["default"](this, PaymentDeserializer);
  }

  _createClass__default["default"](PaymentDeserializer, [{
    key: "deserialize",
    value: function deserialize(serializedPaymentBase64) {
      try {
        var serializedPayment = PaymentDeserializer.serializedPaymentBase64Deserializer.deserialize(serializedPaymentBase64);
        return serializedPayment ? this.mapSerializedPaymentToPayment(serializedPayment) : null;
      } catch (_unused) {
        return null;
      }
    }
  }, {
    key: "mapSerializedPaymentToPayment",
    value: function mapSerializedPaymentToPayment(serializedPayment) {
      return {
        type: exports.PaymentType.Payment,
        id: serializedPayment.i,
        amount: new BigNumber__default["default"](serializedPayment.a),
        targetAddress: serializedPayment.t,
        asset: serializedPayment.as ? this.mapSerializedPaymentAssetToPaymentAsset(serializedPayment.as) : undefined,
        data: serializedPayment.d,
        successUrl: serializedPayment.su ? new URL(serializedPayment.su) : undefined,
        cancelUrl: serializedPayment.cu ? new URL(serializedPayment.cu) : undefined,
        created: new Date(serializedPayment.c),
        expired: serializedPayment.e ? new Date(serializedPayment.e) : undefined,
        signature: this.mapSerializedPaymentSignatureToPaymentSignature(serializedPayment.s)
      };
    }
  }, {
    key: "mapSerializedPaymentAssetToPaymentAsset",
    value: function mapSerializedPaymentAssetToPaymentAsset(serializedPaymentAsset) {
      return {
        address: serializedPaymentAsset.a,
        decimals: serializedPaymentAsset.d,
        id: serializedPaymentAsset.i !== undefined ? serializedPaymentAsset.i : null
      };
    }
  }, {
    key: "mapSerializedPaymentSignatureToPaymentSignature",
    value: function mapSerializedPaymentSignatureToPaymentSignature(serializedPaymentSignature) {
      return {
        signingPublicKey: serializedPaymentSignature.k,
        contract: serializedPaymentSignature.c,
        client: serializedPaymentSignature.cl
      };
    }
  }]);

  return PaymentDeserializer;
}();

_defineProperty__default["default"](PaymentDeserializer, "serializedPaymentBase64Deserializer", new Base64Deserializer(serializedPaymentFieldTypes));

new Map() // address
.set('a', 'string') // id
.set('i', ['number', 'undefined', 'null']);

new Map() // client
.set('cl', 'string') // signature.signingPublicKey
.set('k', 'string');

var serializedDonationFieldTypes = new Map() // data
.set('d', ['object', 'undefined', 'null']) // desiredAmount
.set('da', ['string', 'undefined', 'null']) // desiredAsset
.set('das', ['object', 'undefined', 'null']) // .set('das', serializedDonationAssetFieldTypes)
// successUrl
.set('su', ['string', 'undefined', 'null']) // cancelUrl
.set('cu', ['string', 'undefined', 'null']) // signature
.set('s', ['object', 'undefined', 'null']); // .set('da', serializedDonationSignatureFieldTypes)

var serializedEmptyObjectBase64 = 'e30';
var DonationSerializer = /*#__PURE__*/function () {
  function DonationSerializer() {
    _classCallCheck__default["default"](this, DonationSerializer);
  }

  _createClass__default["default"](DonationSerializer, [{
    key: "serialize",
    value: function serialize(donation) {
      try {
        var serializedDonation = this.mapDonationToSerializedDonation(donation);
        var serializedDonationBase64 = DonationSerializer.serializedDonationBase64Serializer.serialize(serializedDonation);
        return serializedDonationBase64 === serializedEmptyObjectBase64 ? '' : serializedDonationBase64;
      } catch (_unused) {
        return null;
      }
    }
  }, {
    key: "mapDonationToSerializedDonation",
    value: function mapDonationToSerializedDonation(donation) {
      var _donation$desiredAmou, _donation$successUrl, _donation$cancelUrl;

      return {
        d: donation.data,
        da: (_donation$desiredAmou = donation.desiredAmount) === null || _donation$desiredAmou === void 0 ? void 0 : _donation$desiredAmou.toString(10),
        das: donation.desiredAsset ? this.mapDonationAssetToSerializedDonationAsset(donation.desiredAsset) : undefined,
        su: (_donation$successUrl = donation.successUrl) === null || _donation$successUrl === void 0 ? void 0 : _donation$successUrl.toString(),
        cu: (_donation$cancelUrl = donation.cancelUrl) === null || _donation$cancelUrl === void 0 ? void 0 : _donation$cancelUrl.toString(),
        s: donation.signature ? this.mapDonationSignatureToSerializedDonationSignature(donation.signature) : undefined
      };
    }
  }, {
    key: "mapDonationAssetToSerializedDonationAsset",
    value: function mapDonationAssetToSerializedDonationAsset(donationAsset) {
      return {
        a: donationAsset.address,
        i: donationAsset.id !== null ? donationAsset.id : undefined
      };
    }
  }, {
    key: "mapDonationSignatureToSerializedDonationSignature",
    value: function mapDonationSignatureToSerializedDonationSignature(donationSignature) {
      return {
        k: donationSignature.signingPublicKey,
        cl: donationSignature.client
      };
    }
  }]);

  return DonationSerializer;
}();

_defineProperty__default["default"](DonationSerializer, "serializedDonationBase64Serializer", new Base64Serializer(serializedDonationFieldTypes));

var DonationDeserializer = /*#__PURE__*/function () {
  function DonationDeserializer() {
    _classCallCheck__default["default"](this, DonationDeserializer);
  }

  _createClass__default["default"](DonationDeserializer, [{
    key: "deserialize",
    value: function deserialize(serializedDonationBase64, nonSerializedDonationSlice) {
      try {
        var serializedDonation = DonationDeserializer.serializedDonationBase64Deserializer.deserialize(serializedDonationBase64);
        return serializedDonation ? this.mapSerializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) : null;
      } catch (_unused) {
        return null;
      }
    }
  }, {
    key: "mapSerializedDonationToDonation",
    value: function mapSerializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) {
      return {
        type: exports.PaymentType.Donation,
        data: serializedDonation.d,
        desiredAmount: serializedDonation.da ? new BigNumber__default["default"](serializedDonation.da) : undefined,
        desiredAsset: serializedDonation.das ? this.mapSerializedDonationAssetToDonationAsset(serializedDonation.das) : undefined,
        successUrl: serializedDonation.su ? new URL(serializedDonation.su) : undefined,
        cancelUrl: serializedDonation.cu ? new URL(serializedDonation.cu) : undefined,
        targetAddress: nonSerializedDonationSlice.targetAddress,
        signature: serializedDonation.s ? this.mapSerializedDonationSignatureToDonationSignature(serializedDonation.s) : undefined
      };
    }
  }, {
    key: "mapSerializedDonationAssetToDonationAsset",
    value: function mapSerializedDonationAssetToDonationAsset(serializedDonationAsset) {
      return {
        address: serializedDonationAsset.a,
        id: serializedDonationAsset.i !== undefined ? serializedDonationAsset.i : null
      };
    }
  }, {
    key: "mapSerializedDonationSignatureToDonationSignature",
    value: function mapSerializedDonationSignatureToDonationSignature(serializedDonationSignature) {
      return {
        signingPublicKey: serializedDonationSignature.k,
        client: serializedDonationSignature.cl
      };
    }
  }]);

  return DonationDeserializer;
}();

_defineProperty__default["default"](DonationDeserializer, "serializedDonationBase64Deserializer", new Base64Deserializer(serializedDonationFieldTypes));

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf__default["default"](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default["default"](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default["default"](this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Payment = /*#__PURE__*/function (_StateModel) {
  _inherits__default["default"](Payment, _StateModel);

  var _super = _createSuper$2(Payment);

  function Payment() {
    _classCallCheck__default["default"](this, Payment);

    return _super.apply(this, arguments);
  }

  _createClass__default["default"](Payment, null, [{
    key: "validate",
    value: function validate(payment) {
      return Payment.defaultValidator.validate(payment);
    }
  }, {
    key: "deserialize",
    value: function deserialize(serializedPayment) {
      return Payment.defaultDeserializer.deserialize(serializedPayment);
    }
  }]);

  return Payment;
}(StateModel);

_defineProperty__default["default"](Payment, "defaultDeserializer", new PaymentDeserializer());

_defineProperty__default["default"](Payment, "defaultValidator", new PaymentValidator());

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf__default["default"](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default["default"](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default["default"](this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Donation = /*#__PURE__*/function (_StateModel) {
  _inherits__default["default"](Donation, _StateModel);

  var _super = _createSuper$1(Donation);

  function Donation() {
    _classCallCheck__default["default"](this, Donation);

    return _super.apply(this, arguments);
  }

  _createClass__default["default"](Donation, null, [{
    key: "validate",
    value: function validate(donation) {
      return Donation.defaultValidator.validate(donation);
    }
  }, {
    key: "deserialize",
    value: function deserialize(serializedDonation, nonSerializedDonationSlice) {
      return Donation.defaultDeserializer.deserialize(serializedDonation, nonSerializedDonationSlice);
    }
  }]);

  return Donation;
}(StateModel);

_defineProperty__default["default"](Donation, "defaultDeserializer", new DonationDeserializer());

_defineProperty__default["default"](Donation, "defaultValidator", new DonationValidator());

exports.PaymentUrlType = void 0;

(function (PaymentUrlType) {
  PaymentUrlType[PaymentUrlType["Base64"] = 0] = "Base64";
})(exports.PaymentUrlType || (exports.PaymentUrlType = {}));

var encodedPaymentUrlTypeMap = new Map(Object.keys(exports.PaymentUrlType).filter(function (value) {
  return !isNaN(+value);
}).map(function (value) {
  return [+value, padStart(value, 2, '0')];
}));
var getEncodedPaymentUrlType = function getEncodedPaymentUrlType(paymentUrlType) {
  return encodedPaymentUrlTypeMap.get(paymentUrlType) || '';
};

var getParameterizedRoute = function getParameterizedRoute(factory, template) {
  factory.template = template;
  return factory;
};

exports.ServiceOperationType = void 0;

(function (ServiceOperationType) {
  ServiceOperationType[ServiceOperationType["Payment"] = 1] = "Payment";
  ServiceOperationType[ServiceOperationType["Donation"] = 2] = "Donation";
  ServiceOperationType[ServiceOperationType["All"] = 3] = "All";
})(exports.ServiceOperationType || (exports.ServiceOperationType = {}));

var emptyService = {
  name: '',
  description: '',
  links: optimization.emptyArray,
  version: 0,
  metadata: '',
  contractAddress: '',
  allowedTokens: {
    tez: true,
    assets: optimization.emptyArray
  },
  allowedOperationType: exports.ServiceOperationType.Payment,
  owner: '',
  paused: false,
  deleted: false,
  network: networks.mainnet,
  signingKeys: optimization.emptyMap
};

exports.OperationType = void 0;

(function (OperationType) {
  OperationType[OperationType["Payment"] = 1] = "Payment";
  OperationType[OperationType["Donation"] = 2] = "Donation";
})(exports.OperationType || (exports.OperationType = {}));

exports.OperationDirection = void 0;

(function (OperationDirection) {
  OperationDirection[OperationDirection["Incoming"] = 0] = "Incoming";
  OperationDirection[OperationDirection["Outgoing"] = 1] = "Outgoing";
})(exports.OperationDirection || (exports.OperationDirection = {}));

exports.OperationStatus = void 0;

(function (OperationStatus) {
  OperationStatus[OperationStatus["Pending"] = 0] = "Pending";
  OperationStatus[OperationStatus["Success"] = 1] = "Success";
  OperationStatus[OperationStatus["Cancelled"] = 2] = "Cancelled";
})(exports.OperationStatus || (exports.OperationStatus = {}));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf__default["default"](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default["default"](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default["default"](this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var DonationOperation = /*#__PURE__*/function (_StateModel) {
  _inherits__default["default"](DonationOperation, _StateModel);

  var _super = _createSuper(DonationOperation);

  function DonationOperation() {
    _classCallCheck__default["default"](this, DonationOperation);

    return _super.apply(this, arguments);
  }

  _createClass__default["default"](DonationOperation, null, [{
    key: "parsePayload",
    value: function parsePayload(encodedValue) {
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

  return DonationOperation;
}(StateModel);

var DonationSignPayloadEncoder = /*#__PURE__*/function () {
  function DonationSignPayloadEncoder() {
    _classCallCheck__default["default"](this, DonationSignPayloadEncoder);
  }

  _createClass__default["default"](DonationSignPayloadEncoder, [{
    key: "encode",
    value: function encode(donation) {
      return {
        clientSignPayload: this.getClientSignPayload(donation)
      };
    }
  }, {
    key: "getClientSignPayload",
    value: function getClientSignPayload(donation) {
      return (donation.successUrl ? donation.successUrl.href : '') + (donation.cancelUrl ? donation.cancelUrl.href : '') || null;
    }
  }]);

  return DonationSignPayloadEncoder;
}();

// 'Tezos Signed Message: '
var tezosSignedMessagePrefixBytes = '54657a6f73205369676e6564204d6573736167653a20'; // 'Payment Client Data: '

var tezosPaymentsClientSignedMessagePrefixBytes = '5061796d656e7420436c69656e7420446174613a20';

var contractPaymentInTezSignPayloadMichelsonType = {
  prim: 'pair',
  args: [{
    prim: 'pair',
    args: [{
      prim: 'string'
    }, {
      prim: 'address'
    }]
  }, {
    prim: 'mutez'
  }]
};
var contractPaymentInAssetSignPayloadMichelsonType = {
  prim: 'pair',
  args: [{
    prim: 'pair',
    args: [{
      prim: 'pair',
      args: [{
        prim: 'string'
      }, {
        prim: 'address'
      }]
    }, {
      prim: 'pair',
      args: [{
        prim: 'nat'
      }, {
        prim: 'address'
      }]
    }]
  }, {
    prim: 'option',
    args: [{
      prim: 'nat'
    }]
  }]
};

var PaymentSignPayloadEncoder = /*#__PURE__*/function () {
  function PaymentSignPayloadEncoder() {
    _classCallCheck__default["default"](this, PaymentSignPayloadEncoder);
  }

  _createClass__default["default"](PaymentSignPayloadEncoder, [{
    key: "encode",
    value: function encode(payment) {
      return {
        contractSignPayload: this.getContractSignPayload(payment),
        clientSignPayload: this.getClientSignPayload(payment)
      };
    }
  }, {
    key: "getContractSignPayload",
    value: function getContractSignPayload(payment) {
      var signPayload = payment.asset ? michelCodec.packDataBytes({
        prim: 'Pair',
        args: [{
          prim: 'Pair',
          args: [{
            prim: 'Pair',
            args: [{
              string: payment.id
            }, {
              string: payment.targetAddress
            }]
          }, {
            prim: 'Pair',
            args: [{
              "int": tokensAmountToNat(payment.amount, payment.asset.decimals).toString(10)
            }, {
              string: payment.asset.address
            }]
          }]
        }, payment.asset.id !== undefined && payment.asset.id !== null ? {
          prim: 'Some',
          args: [{
            "int": payment.asset.id.toString()
          }]
        } : {
          prim: 'None'
        }]
      }, contractPaymentInAssetSignPayloadMichelsonType) : michelCodec.packDataBytes({
        prim: 'Pair',
        args: [{
          prim: 'Pair',
          args: [{
            string: payment.id
          }, {
            string: payment.targetAddress
          }]
        }, {
          "int": tezToMutez(payment.amount).toString(10)
        }]
      }, contractPaymentInTezSignPayloadMichelsonType);
      return '0x' + signPayload.bytes;
    }
  }, {
    key: "getClientSignPayload",
    value: function getClientSignPayload(payment) {
      var _payment$successUrl, _payment$cancelUrl;

      var clientSignPayload = {
        data: payment.data,
        successUrl: (_payment$successUrl = payment.successUrl) === null || _payment$successUrl === void 0 ? void 0 : _payment$successUrl.href,
        cancelUrl: (_payment$cancelUrl = payment.cancelUrl) === null || _payment$cancelUrl === void 0 ? void 0 : _payment$cancelUrl.href
      };
      var serializedClientSignPayload = JSON.stringify(clientSignPayload, function (_key, value) {
        return value !== undefined && value !== null && value !== '' ? value : undefined;
      });
      if (serializedClientSignPayload === '{}') return null;
      var serializedClientSignPayloadBytes = stringToBytes(serializedClientSignPayload);
      var signedMessageBytes = tezosSignedMessagePrefixBytes + tezosPaymentsClientSignedMessagePrefixBytes + serializedClientSignPayloadBytes;
      var messageLength = padStart((signedMessageBytes.length / 2).toString(16), 8, '0');
      var result = '0x0501' + messageLength + signedMessageBytes;
      return result;
    }
  }]);

  return PaymentSignPayloadEncoder;
}();

_defineProperty__default["default"](PaymentSignPayloadEncoder, "contractPaymentInTezSignPayloadMichelsonType", contractPaymentInTezSignPayloadMichelsonType);

_defineProperty__default["default"](PaymentSignPayloadEncoder, "contractPaymentInAssetSignPayloadMichelsonType", contractPaymentInAssetSignPayloadMichelsonType);

var Ed25519KeyGenerator = /*#__PURE__*/function () {
  function Ed25519KeyGenerator() {
    _classCallCheck__default["default"](this, Ed25519KeyGenerator);

    _defineProperty__default["default"](this, "_isInitialized", false);
  }

  _createClass__default["default"](Ed25519KeyGenerator, [{
    key: "isInitialized",
    get: function get() {
      return this._isInitialized;
    }
  }, {
    key: "generate",
    value: function generate() {
      if (!this.isInitialized) throw new Error('Ed25519 key generator is not initialized');
      var keyPair = sodium__default["default"].crypto_sign_keypair('uint8array');
      var raw = {
        keyType: exports.KeyType.Ed25519,
        privateKey: keyPair.privateKey,
        publicKey: keyPair.publicKey
      };
      var encoded = {
        keyType: exports.KeyType.Ed25519,
        privateKey: utils.b58cencode(raw.privateKey, utils.prefix['edsk']),
        publicKey: utils.b58cencode(raw.publicKey, utils.prefix['edpk'])
      };
      return {
        raw: raw,
        encoded: encoded
      };
    }
  }, {
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee() {
        return _regeneratorRuntime__default["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return sodium__default["default"].ready;

              case 2:
                this._isInitialized = true;

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initialize() {
        return _initialize.apply(this, arguments);
      }

      return initialize;
    }()
  }], [{
    key: "create",
    value: function () {
      var _create = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee2() {
        var instance;
        return _regeneratorRuntime__default["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                instance = new Ed25519KeyGenerator();
                _context2.next = 3;
                return instance.initialize();

              case 3:
                return _context2.abrupt("return", instance);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function create() {
        return _create.apply(this, arguments);
      }

      return create;
    }()
  }]);

  return Ed25519KeyGenerator;
}();

var EllipticCurveKeyGenerator = /*#__PURE__*/function () {
  function EllipticCurveKeyGenerator(curveName) {
    _classCallCheck__default["default"](this, EllipticCurveKeyGenerator);

    this.ec = new elliptic.ec(curveName);
    this.curveInfo = EllipticCurveKeyGenerator.curveInfo[curveName];
  }

  _createClass__default["default"](EllipticCurveKeyGenerator, [{
    key: "generate",
    value: function generate() {
      var keyPair = this.ec.genKeyPair();
      console.log(keyPair);
      var publicBasePoint = keyPair.getPublic();
      var publicPointX = publicBasePoint.getX().toArray();
      var publicPointY = publicBasePoint.getY().toArray(); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

      var firstByte = publicPointY[publicPointY.length - 1] % 2 ? 3 : 2;
      var privateKey = new Uint8Array(keyPair.getPrivate().toArray());
      var pad = new Array(32).fill(0);
      var publicKey = new Uint8Array([firstByte].concat(pad.concat(publicPointX).slice(-32)));
      var raw = {
        keyType: exports.KeyType.P256,
        privateKey: privateKey,
        publicKey: publicKey
      };
      var encoded = {
        keyType: this.curveInfo.keyType,
        privateKey: utils.b58cencode(privateKey, this.curveInfo.privateKeyPrefix),
        publicKey: utils.b58cencode(publicKey, this.curveInfo.publicKeyPrefix)
      };
      return {
        raw: raw,
        encoded: encoded
      };
    }
  }]);

  return EllipticCurveKeyGenerator;
}();

_defineProperty__default["default"](EllipticCurveKeyGenerator, "curveInfo", {
  secp256k1: {
    name: 'secp256k1',
    keyType: exports.KeyType.Secp256k1,
    privateKeyPrefix: utils.prefix['spsk'],
    publicKeyPrefix: utils.prefix['sppk']
  },
  p256: {
    name: 'p256',
    keyType: exports.KeyType.P256,
    privateKeyPrefix: utils.prefix['p2sk'],
    publicKeyPrefix: utils.prefix['p2pk']
  }
});

Object.defineProperty(exports, 'combineClassNames', {
  enumerable: true,
  get: function () { return clsx__default["default"]; }
});
exports.Base64Deserializer = Base64Deserializer;
exports.Base64Serializer = Base64Serializer;
exports.Donation = Donation;
exports.DonationDeserializer = DonationDeserializer;
exports.DonationOperation = DonationOperation;
exports.DonationSerializer = DonationSerializer;
exports.DonationSignPayloadEncoder = DonationSignPayloadEncoder;
exports.DonationValidator = DonationValidator;
exports.Ed25519KeyGenerator = Ed25519KeyGenerator;
exports.EllipticCurveKeyGenerator = EllipticCurveKeyGenerator;
exports.EventEmitter = EventEmitter;
exports.Payment = Payment;
exports.PaymentDeserializer = PaymentDeserializer;
exports.PaymentSerializer = PaymentSerializer;
exports.PaymentSignPayloadEncoder = PaymentSignPayloadEncoder;
exports.PaymentValidator = PaymentValidator;
exports.ServiceLinkHelper = ServiceLinkHelper;
exports.StateModel = StateModel;
exports.base64 = base64;
exports.converters = converters;
exports.emptyService = emptyService;
exports.getEncodedPaymentUrlType = getEncodedPaymentUrlType;
exports.getParameterizedRoute = getParameterizedRoute;
exports.guards = guards;
exports.memoize = memoize;
exports.native = index;
exports.networkIdRegExp = networkIdRegExp;
exports.networkNameRegExp = networkNameRegExp;
exports.networks = networks;
exports.networksCollection = networksCollection;
exports.optimization = optimization;
exports.shallowEqual = shallowEqual;
exports.text = text;
exports.tezosInfo = tezosInfo;
exports.tezosMeta = tezosMeta;
exports.tokenWhitelist = tokenWhitelist;
exports.tokenWhitelistMap = tokenWhitelistMap;
exports.unknownAssetMeta = unknownAssetMeta;
exports.wait = wait;
//# sourceMappingURL=index.es5.cjs.js.map
