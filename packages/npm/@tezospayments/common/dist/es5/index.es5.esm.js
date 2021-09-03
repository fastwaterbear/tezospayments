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
import BigNumber from 'bignumber.js';
import { URL as URL$1 } from 'url';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';

var isBase64UrlFormatSupported = Buffer.isEncoding('base64url');
var decode = function decode(base64String) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base64';
  if (format !== 'base64' && format !== 'base64url') return '';

  if (!isBase64UrlFormatSupported) {
    format = 'base64';
    base64String = base64UrlPreprocessor.prepareValueForDecoding(base64String);
  }

  return Buffer.from(base64String, format).toString('utf8');
};
var encode = function encode(value) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base64';
  if (format !== 'base64' && format !== 'base64url') return '';
  if (isBase64UrlFormatSupported) return Buffer.from(value, 'utf8').toString(format);
  var encodedValue = Buffer.from(value, 'utf8').toString('base64');
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
  return x === y ? x !== 0 || y !== 0 || 1 / x === 1 / y // eslint-disable-next-line no-self-compare
  : x !== x && y !== y;
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
  if (formattedLink === baseUrl) return false;
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

function _createForOfIteratorHelper$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var PaymentValidatorBase = /*#__PURE__*/function () {
  function PaymentValidatorBase() {
    _classCallCheck(this, PaymentValidatorBase);
  }

  _createClass(PaymentValidatorBase, [{
    key: "validate",
    value: function validate(payment) {
      var bail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (!isPlainObject(payment)) return [this.invalidPaymentObjectError];
      var failedValidationResults;

      var _iterator = _createForOfIteratorHelper$2(this.validationMethods),
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
var networkIdRegExp = /^[a-zA-Z]\w*$/;
var networkNameRegExp = networkIdRegExp;

var tezosMeta = {
  symbol: 'XTZ',
  name: 'Tezos',
  decimals: 6,
  thumbnailUri: 'https://dashboard.tezospayments.com/tokens/tezos.png'
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
    thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png'
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

var KeyType;

(function (KeyType) {
  KeyType["Ed25519"] = "Ed25519";
  KeyType["Secp256k1"] = "Secp256k1";
  KeyType["P256"] = "P256";
})(KeyType || (KeyType = {}));

/* eslint-disable @typescript-eslint/no-redeclare */
var URL = URL$1 || globalThis.URL;

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  URL: URL
});

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
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
  if (!BigNumber.isBigNumber(amount) || amount.isNaN() || !amount.isFinite()) return [errors.invalidAmount];
  if (amount.isZero() || amount.isNegative()) return [errors.amountIsNonPositive];
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
  var _iterator = _createForOfIteratorHelper$1(Object.getOwnPropertyNames(obj)),
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
      return validateId(payment.id, PaymentValidator.errors);
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
  invalidTargetAddress: 'Target address is invalid',
  targetAddressIsNotNetworkAddress: 'Target address isn\'t a network address',
  targetAddressHasInvalidLength: 'Target address has an invalid address',
  invalidId: 'Id is invalid',
  emptyId: 'Id is empty',
  invalidAmount: 'Amount is invalid',
  amountIsNonPositive: 'Amount is less than or equal to zero',
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
  amountIsNonPositive: 'Desired amount is less than or equal to zero',
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

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ObjectSerializationValidator = /*#__PURE__*/function () {
  function ObjectSerializationValidator(objectFieldTypes) {
    _classCallCheck(this, ObjectSerializationValidator);

    this.objectFieldTypes = objectFieldTypes;
  }

  _createClass(ObjectSerializationValidator, [{
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
          var _step2$value = _slicedToArray(_step2.value, 2),
              fieldName = _step2$value[0],
              expectedFieldType = _step2$value[1];

          var fieldValue = value[fieldName];
          var actualFieldType = fieldValue === null ? 'null' : _typeof(fieldValue);

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

  return ObjectSerializationValidator;
}();

var Base64Serializer = /*#__PURE__*/function () {
  function Base64Serializer(fieldTypes) {
    _classCallCheck(this, Base64Serializer);

    this.objectSerializationValidator = new ObjectSerializationValidator(fieldTypes);
  }

  _createClass(Base64Serializer, [{
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
    _classCallCheck(this, Base64Deserializer);

    this.objectSerializationValidator = new ObjectSerializationValidator(fieldTypes);
  }

  _createClass(Base64Deserializer, [{
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

var serializedPaymentFieldTypes = new Map() // id
.set('i', 'string') // amount
.set('a', 'string') // data
.set('d', 'object') // asset
.set('as', ['string', 'undefined', 'null']) // successUrl
.set('su', ['string', 'undefined', 'null']) // cancelUrl
.set('cu', ['string', 'undefined', 'null']) // created
.set('c', 'number') // expired
.set('e', ['number', 'undefined', 'null']);
var legacySerializedPaymentFieldTypes = new Map().set('amount', 'string').set('data', 'object').set('asset', ['string', 'undefined', 'null']).set('successUrl', ['string', 'undefined', 'null']).set('cancelUrl', ['string', 'undefined', 'null']).set('created', 'number').set('expired', ['number', 'undefined', 'null']);

var PaymentSerializer = /*#__PURE__*/function () {
  function PaymentSerializer() {
    _classCallCheck(this, PaymentSerializer);
  }

  _createClass(PaymentSerializer, [{
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
        a: payment.amount.toString(),
        d: payment.data,
        as: payment.asset,
        su: (_payment$successUrl = payment.successUrl) === null || _payment$successUrl === void 0 ? void 0 : _payment$successUrl.toString(),
        cu: (_payment$cancelUrl = payment.cancelUrl) === null || _payment$cancelUrl === void 0 ? void 0 : _payment$cancelUrl.toString(),
        c: payment.created.getTime(),
        e: (_payment$expired = payment.expired) === null || _payment$expired === void 0 ? void 0 : _payment$expired.getTime()
      };
    }
  }]);

  return PaymentSerializer;
}();

_defineProperty(PaymentSerializer, "serializedPaymentBase64Serializer", new Base64Serializer(serializedPaymentFieldTypes));

var PaymentDeserializer = /*#__PURE__*/function () {
  function PaymentDeserializer() {
    _classCallCheck(this, PaymentDeserializer);
  }

  _createClass(PaymentDeserializer, [{
    key: "deserialize",
    value: function deserialize(serializedPaymentBase64, nonSerializedPaymentSlice) {
      try {
        var serializedPayment = PaymentDeserializer.serializedPaymentBase64Deserializer.deserialize(serializedPaymentBase64);
        return serializedPayment ? this.mapSerializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) : null;
      } catch (_unused) {
        return null;
      }
    }
  }, {
    key: "mapSerializedPaymentToPayment",
    value: function mapSerializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) {
      return {
        type: PaymentType.Payment,
        id: serializedPayment.i,
        amount: new BigNumber(serializedPayment.a),
        data: serializedPayment.d,
        asset: serializedPayment.as,
        successUrl: serializedPayment.su ? new URL(serializedPayment.su) : undefined,
        cancelUrl: serializedPayment.cu ? new URL(serializedPayment.cu) : undefined,
        created: new Date(serializedPayment.c),
        expired: serializedPayment.e ? new Date(serializedPayment.e) : undefined,
        targetAddress: nonSerializedPaymentSlice.targetAddress
      };
    }
  }]);

  return PaymentDeserializer;
}();

_defineProperty(PaymentDeserializer, "serializedPaymentBase64Deserializer", new Base64Deserializer(serializedPaymentFieldTypes));

var LegacyPaymentDeserializer = /*#__PURE__*/function () {
  function LegacyPaymentDeserializer() {
    _classCallCheck(this, LegacyPaymentDeserializer);
  }

  _createClass(LegacyPaymentDeserializer, [{
    key: "deserialize",
    value: function deserialize(serializedPaymentBase64, nonSerializedPaymentSlice) {
      try {
        var serializedPayment = LegacyPaymentDeserializer.serializedPaymentBase64Deserializer.deserialize(serializedPaymentBase64);
        return serializedPayment ? this.mapSerializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) : null;
      } catch (_unused) {
        return null;
      }
    }
  }, {
    key: "mapSerializedPaymentToPayment",
    value: function mapSerializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) {
      return {
        type: PaymentType.Payment,
        id: 'legacy-payment',
        amount: new BigNumber(serializedPayment.amount),
        data: serializedPayment.data,
        asset: serializedPayment.asset,
        successUrl: serializedPayment.successUrl ? new URL(serializedPayment.successUrl) : undefined,
        cancelUrl: serializedPayment.cancelUrl ? new URL(serializedPayment.cancelUrl) : undefined,
        created: new Date(serializedPayment.created),
        expired: serializedPayment.expired ? new Date(serializedPayment.expired) : undefined,
        targetAddress: nonSerializedPaymentSlice.targetAddress
      };
    }
  }]);

  return LegacyPaymentDeserializer;
}();

_defineProperty(LegacyPaymentDeserializer, "serializedPaymentBase64Deserializer", new Base64Deserializer(legacySerializedPaymentFieldTypes));

var serializedDonationFieldTypes = new Map() // desiredAmount
.set('da', ['string', 'undefined', 'null']) // desiredAsset
.set('das', ['string', 'undefined', 'null']) // successUrl
.set('su', ['string', 'undefined', 'null']) // cancelUrl
.set('cu', ['string', 'undefined', 'null']);
var legacySerializedDonationFieldTypes = new Map().set('desiredAmount', ['string', 'undefined', 'null']).set('desiredAsset', ['string', 'undefined', 'null']).set('successUrl', ['string', 'undefined', 'null']).set('cancelUrl', ['string', 'undefined', 'null']);

var serializedEmptyObjectBase64 = 'e30';
var DonationSerializer = /*#__PURE__*/function () {
  function DonationSerializer() {
    _classCallCheck(this, DonationSerializer);
  }

  _createClass(DonationSerializer, [{
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
        da: (_donation$desiredAmou = donation.desiredAmount) === null || _donation$desiredAmou === void 0 ? void 0 : _donation$desiredAmou.toString(),
        das: donation.desiredAsset,
        su: (_donation$successUrl = donation.successUrl) === null || _donation$successUrl === void 0 ? void 0 : _donation$successUrl.toString(),
        cu: (_donation$cancelUrl = donation.cancelUrl) === null || _donation$cancelUrl === void 0 ? void 0 : _donation$cancelUrl.toString()
      };
    }
  }]);

  return DonationSerializer;
}();

_defineProperty(DonationSerializer, "serializedDonationBase64Serializer", new Base64Serializer(serializedDonationFieldTypes));

var DonationDeserializer = /*#__PURE__*/function () {
  function DonationDeserializer() {
    _classCallCheck(this, DonationDeserializer);
  }

  _createClass(DonationDeserializer, [{
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
        type: PaymentType.Donation,
        desiredAmount: serializedDonation.da ? new BigNumber(serializedDonation.da) : undefined,
        desiredAsset: serializedDonation.das,
        successUrl: serializedDonation.su ? new URL(serializedDonation.su) : undefined,
        cancelUrl: serializedDonation.cu ? new URL(serializedDonation.cu) : undefined,
        targetAddress: nonSerializedDonationSlice.targetAddress
      };
    }
  }]);

  return DonationDeserializer;
}();

_defineProperty(DonationDeserializer, "serializedDonationBase64Deserializer", new Base64Deserializer(serializedDonationFieldTypes));

var LegacyDonationDeserializer = /*#__PURE__*/function () {
  function LegacyDonationDeserializer() {
    _classCallCheck(this, LegacyDonationDeserializer);
  }

  _createClass(LegacyDonationDeserializer, [{
    key: "deserialize",
    value: function deserialize(serializedDonationBase64, nonSerializedDonationSlice) {
      try {
        var serializedDonation = LegacyDonationDeserializer.serializedDonationBase64Deserializer.deserialize(serializedDonationBase64);
        return serializedDonation ? this.mapSerializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) : null;
      } catch (_unused) {
        return null;
      }
    }
  }, {
    key: "mapSerializedDonationToDonation",
    value: function mapSerializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) {
      return {
        type: PaymentType.Donation,
        desiredAmount: serializedDonation.desiredAmount ? new BigNumber(serializedDonation.desiredAmount) : undefined,
        desiredAsset: serializedDonation.desiredAsset,
        successUrl: serializedDonation.successUrl ? new URL(serializedDonation.successUrl) : undefined,
        cancelUrl: serializedDonation.cancelUrl ? new URL(serializedDonation.cancelUrl) : undefined,
        targetAddress: nonSerializedDonationSlice.targetAddress
      };
    }
  }]);

  return LegacyDonationDeserializer;
}();

_defineProperty(LegacyDonationDeserializer, "serializedDonationBase64Deserializer", new Base64Deserializer(legacySerializedDonationFieldTypes));

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
    key: "deserialize",
    value: function deserialize(serializedPayment, nonSerializedPaymentSlice) {
      var isLegacy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      return !isLegacy ? Payment.defaultDeserializer.deserialize(serializedPayment, nonSerializedPaymentSlice) : Payment.defaultLegacyDeserializer.deserialize(serializedPayment, nonSerializedPaymentSlice);
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

_defineProperty(Payment, "defaultDeserializer", new PaymentDeserializer());

_defineProperty(Payment, "defaultLegacyDeserializer", new LegacyPaymentDeserializer());

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
    key: "deserialize",
    value: function deserialize(serializedDonation, nonSerializedDonationSlice) {
      var isLegacy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      return !isLegacy ? Donation.defaultDeserializer.deserialize(serializedDonation, nonSerializedDonationSlice) : Donation.defaultLegacyDeserializer.deserialize(serializedDonation, nonSerializedDonationSlice);
    }
  }]);

  return Donation;
}(StateModel);

_defineProperty(Donation, "defaultDeserializer", new DonationDeserializer());

_defineProperty(Donation, "defaultLegacyDeserializer", new LegacyDonationDeserializer());

_defineProperty(Donation, "defaultValidator", new DonationValidator());

var PaymentUrlType;

(function (PaymentUrlType) {
  PaymentUrlType[PaymentUrlType["Base64"] = 0] = "Base64";
})(PaymentUrlType || (PaymentUrlType = {}));

var encodedPaymentUrlTypeMap = new Map(Object.keys(PaymentUrlType).filter(function (value) {
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
  network: networks.edo2net,
  signingKeys: {}
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

export { Base64Deserializer, Base64Serializer, Donation, DonationDeserializer, DonationSerializer, DonationValidator, IconId, KeyType, LegacyDonationDeserializer, LegacyPaymentDeserializer, Payment, PaymentDeserializer, PaymentSerializer, PaymentType, PaymentUrlType, PaymentValidator, ServiceLinkHelper, ServiceOperation, ServiceOperationDirection, ServiceOperationStatus, ServiceOperationType, StateModel, base64, converters, emptyService, getEncodedPaymentUrlType, getParameterizedRoute, guards, memoize, index as native, networkIdRegExp, networkNameRegExp, networks, networksCollection, optimization, shallowEqual, text, tezosInfo, tezosMeta, tokenWhitelist, tokenWhitelistMap, wait };
//# sourceMappingURL=index.es5.esm.js.map
