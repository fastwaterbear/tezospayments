'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var clsx = require('clsx');
var buffer = require('buffer');
var BigNumber = require('bignumber.js');
var isPlainObjectLodashFunction = require('lodash.isplainobject');
var url = require('url');
var michelCodec = require('@taquito/michel-codec');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var clsx__default = /*#__PURE__*/_interopDefaultLegacy(clsx);
var BigNumber__default = /*#__PURE__*/_interopDefaultLegacy(BigNumber);
var isPlainObjectLodashFunction__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObjectLodashFunction);

const isBase64UrlFormatSupported = buffer.Buffer.isEncoding('base64url');
const decode = (base64String, format = 'base64') => {
  if (format !== 'base64' && format !== 'base64url') return '';

  if (!isBase64UrlFormatSupported) {
    format = 'base64';
    base64String = base64UrlPreprocessor.prepareValueForDecoding(base64String);
  }

  return buffer.Buffer.from(base64String, format).toString('utf8');
};
const encode = (value, format = 'base64') => {
  if (format !== 'base64' && format !== 'base64url') return '';
  if (isBase64UrlFormatSupported) return buffer.Buffer.from(value, 'utf8').toString(format);
  const encodedValue = buffer.Buffer.from(value, 'utf8').toString('base64');
  return base64UrlPreprocessor.prepareEncodedValue(encodedValue);
};
const base64UrlPreprocessor = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  prepareEncodedValue: base64value => base64value.split('=')[0].replace(/\+/g, '-').replace(/\//g, '_'),
  prepareValueForDecoding: base64value => {
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

const stringToUint8Array = hex => {
  var _hex$match;

  const integers = (_hex$match = hex.match(/[\da-f]{2}/gi)) === null || _hex$match === void 0 ? void 0 : _hex$match.map(val => parseInt(val, 16)); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

  return new Uint8Array(integers);
};
const stringToBytes = value => buffer.Buffer.from(value, 'utf8').toString('hex');
const bytesToString = value => buffer.Buffer.from(stringToUint8Array(value)).toString('utf8');
const objectToBytes = value => stringToBytes(JSON.stringify(value));
const bytesToObject = value => {
  try {
    return JSON.parse(bytesToString(value));
  } catch {
    return null;
  }
};
const tokensAmountToNat = (tokensAmount, decimals) => {
  return new BigNumber__default["default"](tokensAmount).multipliedBy(10 ** decimals).integerValue();
};
const numberToTokensAmount = (value, decimals) => {
  return new BigNumber__default["default"](value).integerValue().div(10 ** decimals);
};
const tezToMutez = tez => tokensAmountToNat(tez, 6);
const mutezToTez = mutez => numberToTokensAmount(mutez, 6);

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

const isArray = arg => {
  return Array.isArray(arg);
};
const isReadonlyArray = arg => {
  return Array.isArray(arg);
};
const isPlainObject = value => {
  return isPlainObjectLodashFunction__default["default"](value);
};

var guards = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isArray: isArray,
  isReadonlyArray: isReadonlyArray,
  isPlainObject: isPlainObject
});

const defaultEqualityCheck = (a, b) => a === b;

const areArgumentsShallowlyEqual = (equalityCheck, prev, next) => {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  } // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.


  const length = prev.length;

  for (let i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
};
/* eslint-disable prefer-rest-params  */

/* eslint-disable prefer-spread */

/* eslint-disable @typescript-eslint/no-explicit-any */


const memoize = (func, equalityCheck = defaultEqualityCheck) => {
  let lastArgs = null;
  let lastResult = null;
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

const emptyArray = [];
const emptyObject = {};
const emptyMap = new Map();
const emptySet = new Set();
const zeroBigNumber = new BigNumber__default["default"](0);
var optimization = {
  emptyArray,
  emptyMap,
  emptySet,
  emptyObject,
  zeroBigNumber
};

const is = (x, y) => {
  return x === y ? x !== 0 || y !== 0 || 1 / x === 1 / y // eslint-disable-next-line no-self-compare
  : x !== x && y !== y;
};

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) return false;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    /* eslint-disable @typescript-eslint/no-explicit-any */

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) return false;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  return true;
}

const capitalize = value => {
  var _value$;

  return value && ((_value$ = value[0]) === null || _value$ === void 0 ? void 0 : _value$.toLocaleUpperCase()) + value.slice(1);
};
const getAvatarText = (value, maxLength = 2) => {
  if (!value || !maxLength) return '';
  let result = '';

  for (let i = 0, j = 0, isWord = false; i < value.length; i++) {
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

const stringPad = (string, isStart, maxLength, fillString = ' ') => {
  if (String.prototype.padStart !== undefined) return string.padStart(maxLength, fillString);
  const stringLength = string.length; // eslint-disable-next-line eqeqeq

  if (maxLength <= stringLength || fillString == '') return string;
  const fillLength = maxLength - stringLength;
  let filler = fillString.repeat(Math.ceil(fillLength / fillString.length));
  if (filler.length > fillLength) filler = filler.slice(0, fillLength);
  return isStart ? filler + string : string + filler;
};

const padStart = (string, maxLength, fillString = ' ') => String.prototype.padStart !== undefined ? string.padStart(maxLength, fillString) : stringPad(string, true, maxLength, fillString);
const padEnd = (string, maxLength, fillString = ' ') => String.prototype.padEnd !== undefined ? string.padEnd(maxLength, fillString) : stringPad(string, false, maxLength, fillString);

var text = /*#__PURE__*/Object.freeze({
  __proto__: null,
  capitalize: capitalize,
  getAvatarText: getAvatarText,
  padStart: padStart,
  padEnd: padEnd
});

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

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

const getInvalidLinkInfo = link => ({
  rawLink: link,
  formattedLink: '#',
  displayLink: 'Invalid Link',
  icon: exports.IconId.Common
});

const prepareFormattedLink = memoize(link => link.trim());
const prepareDisplayLink = memoize(link => link.trim().replace(/\/$/, ''));

const socialMediaLinkInfoProvider = (link, baseUrl, icon) => {
  if (!link.startsWith(baseUrl)) return false;
  const formattedLink = prepareFormattedLink(link);
  if (formattedLink === baseUrl) return false;
  return {
    rawLink: link,
    formattedLink,
    displayLink: prepareDisplayLink(link).replace(baseUrl, ''),
    icon
  };
};

const telegramLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://t.me/', exports.IconId.Telegram);

const facebookLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://facebook.com/', exports.IconId.Facebook);

const twitterLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://twitter.com/', exports.IconId.Twitter);

const instagramLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://instagram.com/', exports.IconId.Instagram);

const gitHubLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://github.com/', exports.IconId.GitHub);

const redditLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://www.reddit.com/', exports.IconId.Reddit); // This regex should not use for email validation


const emailCheckingRegEx = /^[^\s/@]+@[^\s@/]+$/;

const emailLinkInfoProvider = link => {
  const preparedFormattedLink = prepareFormattedLink(link);
  return emailCheckingRegEx.test(preparedFormattedLink) && {
    rawLink: link,
    formattedLink: `mailto:${preparedFormattedLink}`,
    displayLink: prepareDisplayLink(link),
    icon: exports.IconId.Email
  };
};

const javascriptLinkInfoProvider = link => link.startsWith('javascript') ? getInvalidLinkInfo(link) : false; // https://datatracker.ietf.org/doc/html/rfc3986#section-3.1


const urlSchemeRegEx = /^([a-z][a-z0-9+\-.]*):/;

const commonLinkInfoProvider = link => {
  const formattedLink = prepareFormattedLink(link);
  return urlSchemeRegEx.test(formattedLink) && {
    rawLink: link,
    formattedLink,
    displayLink: prepareDisplayLink(link),
    icon: exports.IconId.Common
  };
};

const editLinkInfoProvider = link => {
  const formattedLink = prepareFormattedLink(link);
  return {
    rawLink: link,
    formattedLink,
    displayLink: prepareDisplayLink(link),
    icon: exports.IconId.Common
  };
};

class ServiceLinkHelper {
  // Order is important
  getLinkInfo(link, isEditMode = false) {
    for (const provider of ServiceLinkHelper.linkInfoProviders) {
      const linkInfo = provider(link);
      if (linkInfo) return this.linkInfoIsValid(linkInfo) ? linkInfo : null;
    }

    if (isEditMode) return editLinkInfoProvider(link);
    return null;
  }

  linkInfoIsValid(linkInfo) {
    return linkInfo.formattedLink !== '#';
  }

}

_defineProperty__default["default"](ServiceLinkHelper, "linkInfoProviders", [// Disallowed
javascriptLinkInfoProvider, // Allowed
telegramLinkInfoProvider, facebookLinkInfoProvider, twitterLinkInfoProvider, instagramLinkInfoProvider, gitHubLinkInfoProvider, emailLinkInfoProvider, redditLinkInfoProvider, commonLinkInfoProvider]);

exports.PaymentType = void 0;

(function (PaymentType) {
  PaymentType[PaymentType["Payment"] = 1] = "Payment";
  PaymentType[PaymentType["Donation"] = 2] = "Donation";
})(exports.PaymentType || (exports.PaymentType = {}));

class PaymentValidatorBase {
  validate(payment, bail = false) {
    if (!isPlainObject(payment)) return [this.invalidPaymentObjectError];
    let failedValidationResults;

    for (const validationMethod of this.validationMethods) {
      const currentFailedValidationResults = validationMethod(payment);

      if (currentFailedValidationResults) {
        if (!bail) return currentFailedValidationResults;
        failedValidationResults = (failedValidationResults || []).concat(currentFailedValidationResults);
      }
    }

    return failedValidationResults;
  }

}

const networksInternal = {
  // mainnet: {
  //   id: 'NetXdQprcVkpaWU',
  //   name: 'mainnet',
  // },
  granadanet: {
    id: 'NetXz969SFaFn8k',
    name: 'granadanet'
  }
};
const networks = networksInternal;
const networksCollection = Object.values(networksInternal);
const networkIdRegExp = /^[a-zA-Z]\w*$/;
const networkNameRegExp = networkIdRegExp;

const tezosMeta = {
  symbol: 'XTZ',
  name: 'Tezos',
  decimals: 6,
  thumbnailUri: 'https://dashboard.tezospayments.com/tokens/tezos.png'
};
const unknownAssetMeta = {
  name: 'Unknown',
  symbol: 'Unknown',
  decimals: 0,
  thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png'
};
const tokenWhitelist = [// {
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
  network: networks.granadanet,
  type: 'fa1.2',
  contractAddress: 'KT1KcuD9MmgZuGcptdD3qRqxXpGg4WxFsfVc',
  metadata: {
    decimals: 0,
    symbol: 'fa12',
    name: 'Test fa12',
    thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png'
  }
}, {
  network: networks.granadanet,
  type: 'fa2',
  contractAddress: 'KT1BBfxboq63dbaKCAc4uwVKLFzVn1b4fy37',
  id: 0,
  metadata: {
    decimals: 0,
    symbol: 'fa20',
    name: 'Test fa20',
    thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png'
  }
}, {
  network: networks.granadanet,
  type: 'fa2',
  contractAddress: 'KT1PMAT81mmL6NFp9rVU3xoVzU2dRdcXt4R9',
  id: 0,
  metadata: {
    decimals: 6,
    symbol: 'USDS',
    name: 'Stably USD',
    thumbnailUri: 'https://quipuswap.com/tokens/stably.png'
  }
}];
const tokenWhitelistMap = new Map(networksCollection.map(nc => [nc, new Map(tokenWhitelist.filter(t => t.network === nc).map(t => [t.contractAddress, t]))]));

const contractAddressPrefixes = ['KT'];
const implicitAddressPrefixes = ['tz1', 'tz2', 'tz3'];
const addressPrefixes = [...contractAddressPrefixes, ...implicitAddressPrefixes];
const tezosInfo = {
  addressLength: 36,
  contractAddressPrefixes,
  implicitAddressPrefixes,
  addressPrefixes
};

exports.KeyType = void 0;

(function (KeyType) {
  KeyType["Ed25519"] = "Ed25519";
  KeyType["Secp256k1"] = "Secp256k1";
  KeyType["P256"] = "P256";
})(exports.KeyType || (exports.KeyType = {}));

/* eslint-disable @typescript-eslint/no-redeclare */
const URL = url.URL || globalThis.URL;

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  URL: URL
});

const validateTargetAddress = (targetAddress, errors) => {
  if (typeof targetAddress !== 'string') return [errors.invalidTargetAddress];
  if (targetAddress.length !== tezosInfo.addressLength) return [errors.targetAddressHasInvalidLength];
  if (!tezosInfo.addressPrefixes.some(prefix => targetAddress.startsWith(prefix))) return [errors.targetAddressIsNotNetworkAddress];
};
const validateId = (id, errors) => {
  if (typeof id !== 'string') return [errors.invalidId];
  if (id === '') return [errors.emptyId];
};
const validateAmount = (amount, errors) => {
  if (!BigNumber__default["default"].isBigNumber(amount) || amount.isNaN() || !amount.isFinite()) return [errors.invalidAmount];
  if (amount.isZero() || amount.isNegative()) return [errors.amountIsNonPositive];
};
const validateDesiredAmount = (desiredAmount, errors) => {
  return desiredAmount === undefined ? undefined : validateAmount(desiredAmount, errors);
};
const validatePaymentAsset = (asset, errors) => {
  if (asset === undefined) return;
  if (!isPlainObject(asset)) return [errors.invalidAsset];
  return validateAsset(asset, errors) || validateAssetDecimals(asset.decimals, errors);
};
const validateDonationAsset = (asset, errors) => {
  if (asset === undefined) return;
  if (!isPlainObject(asset)) return [errors.invalidAsset];
  return validateAsset(asset, errors);
};
const validateCreatedDate = (date, errors) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return [errors.invalidCreatedDate];
};
const validateUrl = (url, errors) => {
  if (url === undefined) return;
  if (!(url instanceof URL)) return [errors.invalidUrl];
  if (url.protocol.indexOf('javascript') > -1) return [errors.invalidProtocol];
};
const validateExpiredDate = (expiredDate, createdDate, minimumPaymentLifetime, errors) => {
  if (expiredDate === undefined) return;
  if (!(expiredDate instanceof Date) || isNaN(expiredDate.getTime())) return [errors.invalidExpiredDate];

  if (expiredDate.getTime() - createdDate.getTime() < minimumPaymentLifetime) {
    return [errors.paymentLifetimeIsShort];
  }
};
const validateData = (data, errors) => {
  if (data === undefined) return;
  if (!isPlainObject(data)) return [errors.invalidData];
};

const validateAsset = (asset, errors) => {
  return validateAssetAddress(asset.address, errors) || validateAssetId(asset.id, errors);
};

const validateAssetAddress = (assetAddress, errors) => {
  if (typeof assetAddress !== 'string') return [errors.invalidAssetAddress];
  if (assetAddress.length !== tezosInfo.addressLength) return [errors.assetAddressHasInvalidLength];
  if (!tezosInfo.contractAddressPrefixes.some(prefix => assetAddress.startsWith(prefix))) return [errors.assetAddressIsNotContractAddress];
};

const validateAssetId = (assetId, errors) => {
  if (assetId === null) return;
  if (typeof assetId !== 'number' || Number.isNaN(assetId) || !Number.isFinite(assetId)) return [errors.invalidAssetId];
  if (assetId < 0) return [errors.assetIdIsNegative];
  if (!Number.isInteger(assetId)) return [errors.assetIdIsNotInteger];
};

const validateAssetDecimals = (assetDecimals, errors) => {
  if (typeof assetDecimals !== 'number' || Number.isNaN(assetDecimals) || !Number.isFinite(assetDecimals)) return [errors.invalidAssetDecimals];
  if (assetDecimals < 0) return [errors.assetDecimalsNumberIsNegative];
  if (!Number.isInteger(assetDecimals)) return [errors.assetDecimalsNumberIsNotInteger];
};

class PaymentValidator extends PaymentValidatorBase {
  constructor(...args) {
    super(...args);

    _defineProperty__default["default"](this, "validationMethods", [payment => payment.type !== exports.PaymentType.Payment ? [PaymentValidator.errors.invalidType] : undefined, payment => validateTargetAddress(payment.targetAddress, PaymentValidator.errors), payment => validateId(payment.id, PaymentValidator.errors), payment => validateAmount(payment.amount, PaymentValidator.errors), payment => validatePaymentAsset(payment.asset, PaymentValidator.errors), payment => validateData(payment.data, PaymentValidator.errors), payment => validateUrl(payment.successUrl, PaymentValidator.successUrlErrors), payment => validateUrl(payment.cancelUrl, PaymentValidator.cancelUrlErrors), payment => validateCreatedDate(payment.created, PaymentValidator.errors), payment => validateExpiredDate(payment.expired, payment.created, PaymentValidator.minimumPaymentLifetime, PaymentValidator.errors)]);

    _defineProperty__default["default"](this, "invalidPaymentObjectError", PaymentValidator.errors.invalidPaymentObject);
  }

}

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

class DonationValidator extends PaymentValidatorBase {
  constructor(...args) {
    super(...args);

    _defineProperty__default["default"](this, "validationMethods", [donation => donation.type !== exports.PaymentType.Donation ? [DonationValidator.errors.invalidType] : undefined, donation => validateData(donation.data, DonationValidator.errors), donation => validateTargetAddress(donation.targetAddress, DonationValidator.errors), donation => validateDesiredAmount(donation.desiredAmount, DonationValidator.errors), donation => validateDonationAsset(donation.desiredAsset, DonationValidator.errors), donation => validateUrl(donation.successUrl, DonationValidator.successUrlErrors), donation => validateUrl(donation.cancelUrl, DonationValidator.cancelUrlErrors)]);

    _defineProperty__default["default"](this, "invalidPaymentObjectError", DonationValidator.errors.invalidDonationObject);
  }

}

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

class StateModel {
  constructor() {// All derived classes should be static
  }

}

class ObjectSerializationValidator {
  constructor(objectFieldTypes) {
    this.objectFieldTypes = objectFieldTypes;
  }

  get minObjectFieldsCount() {
    if (!this._minObjectFieldsCount) {
      let count = 0;

      for (const info of this.objectFieldTypes) {
        if (typeof info[1] === 'string' ? info[1] !== 'undefined' : info[1].every(type => type !== 'undefined')) count++;
      }

      this._minObjectFieldsCount = count;
    }

    return this._minObjectFieldsCount;
  }

  get maxObjectFieldsCount() {
    return this.objectFieldTypes.size;
  }

  validate(value) {
    if (!value) return false;
    const fieldNames = Object.getOwnPropertyNames(value); // Prevent the field checking if the deserializedValue has an invalid number of fields

    if (fieldNames.length < this.minObjectFieldsCount || fieldNames.length > this.maxObjectFieldsCount) return false;

    for (const [fieldName, expectedFieldType] of this.objectFieldTypes) {
      const fieldValue = value[fieldName];
      const actualFieldType = fieldValue === null ? 'null' : typeof fieldValue;

      if (Array.isArray(expectedFieldType) ? !expectedFieldType.some(expectedType => actualFieldType === expectedType) : actualFieldType !== expectedFieldType) {
        return false;
      }
    }

    return true;
  }

}

class Base64Serializer {
  constructor(fieldTypes) {
    this.objectSerializationValidator = new ObjectSerializationValidator(fieldTypes);
  }

  serialize(value) {
    try {
      if (!this.objectSerializationValidator.validate(value)) return null;
      const jsonString = JSON.stringify(value);
      return encode(jsonString, 'base64url');
    } catch {
      return null;
    }
  }

}

class Base64Deserializer {
  constructor(fieldTypes) {
    this.objectSerializationValidator = new ObjectSerializationValidator(fieldTypes);
  }

  deserialize(serializedValue) {
    try {
      let value;

      if (serializedValue) {
        const serializedValueString = decode(serializedValue, 'base64url');
        value = JSON.parse(serializedValueString);
      } else value = {};

      return this.objectSerializationValidator.validate(value) ? value : null;
    } catch {
      return null;
    }
  }

}

new Map() // address
.set('a', 'string') // decimals
.set('d', 'number') // id
.set('i', ['number', 'undefined', 'null']);

new Map() // contract
.set('c', 'string') // client
.set('cl', ['string', 'undefined', 'null']) // signature.signingPublicKey
.set('k', 'string');

const serializedPaymentFieldTypes = new Map() // id
.set('i', 'string') // amount
.set('a', 'string') // asset
.set('as', ['object', 'undefined', 'null']) // .set('as', serializedPaymentAssetFieldTypes)
// data
.set('d', ['object', 'undefined', 'null']) // successUrl
.set('su', ['string', 'undefined', 'null']) // cancelUrl
.set('cu', ['string', 'undefined', 'null']) // created
.set('c', 'number') // expired
.set('e', ['number', 'undefined', 'null']) // signature
.set('s', 'object'); // .set('s', serializedPaymentSignatureFieldTypes);

class PaymentSerializer {
  serialize(payment) {
    try {
      const serializedPayment = this.mapPaymentToSerializedPayment(payment);
      return PaymentSerializer.serializedPaymentBase64Serializer.serialize(serializedPayment);
    } catch {
      return null;
    }
  }

  mapPaymentToSerializedPayment(payment) {
    var _payment$successUrl, _payment$cancelUrl, _payment$expired;

    return {
      i: payment.id,
      a: payment.amount.toString(),
      as: payment.asset ? this.mapPaymentAssetToSerializedPaymentAsset(payment.asset) : undefined,
      d: payment.data,
      su: (_payment$successUrl = payment.successUrl) === null || _payment$successUrl === void 0 ? void 0 : _payment$successUrl.toString(),
      cu: (_payment$cancelUrl = payment.cancelUrl) === null || _payment$cancelUrl === void 0 ? void 0 : _payment$cancelUrl.toString(),
      c: payment.created.getTime(),
      e: (_payment$expired = payment.expired) === null || _payment$expired === void 0 ? void 0 : _payment$expired.getTime(),
      s: this.mapPaymentSignatureToSerializedPaymentSignature(payment.signature)
    };
  }

  mapPaymentAssetToSerializedPaymentAsset(paymentAsset) {
    return {
      a: paymentAsset.address,
      d: paymentAsset.decimals,
      i: paymentAsset.id !== null ? paymentAsset.id : undefined
    };
  }

  mapPaymentSignatureToSerializedPaymentSignature(paymentSignature) {
    return {
      k: paymentSignature.signingPublicKey,
      c: paymentSignature.contract,
      cl: paymentSignature.client
    };
  }

}

_defineProperty__default["default"](PaymentSerializer, "serializedPaymentBase64Serializer", new Base64Serializer(serializedPaymentFieldTypes));

class PaymentDeserializer {
  deserialize(serializedPaymentBase64, nonSerializedPaymentSlice) {
    try {
      const serializedPayment = PaymentDeserializer.serializedPaymentBase64Deserializer.deserialize(serializedPaymentBase64);
      return serializedPayment ? this.mapSerializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) : null;
    } catch {
      return null;
    }
  }

  mapSerializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) {
    return {
      type: exports.PaymentType.Payment,
      id: serializedPayment.i,
      amount: new BigNumber__default["default"](serializedPayment.a),
      asset: serializedPayment.as ? this.mapSerializedPaymentAssetToPaymentAsset(serializedPayment.as) : undefined,
      data: serializedPayment.d,
      successUrl: serializedPayment.su ? new URL(serializedPayment.su) : undefined,
      cancelUrl: serializedPayment.cu ? new URL(serializedPayment.cu) : undefined,
      created: new Date(serializedPayment.c),
      expired: serializedPayment.e ? new Date(serializedPayment.e) : undefined,
      targetAddress: nonSerializedPaymentSlice.targetAddress,
      signature: this.mapSerializedPaymentSignatureToPaymentSignature(serializedPayment.s)
    };
  }

  mapSerializedPaymentAssetToPaymentAsset(serializedPaymentAsset) {
    return {
      address: serializedPaymentAsset.a,
      decimals: serializedPaymentAsset.d,
      id: serializedPaymentAsset.i !== undefined ? serializedPaymentAsset.i : null
    };
  }

  mapSerializedPaymentSignatureToPaymentSignature(serializedPaymentSignature) {
    return {
      signingPublicKey: serializedPaymentSignature.k,
      contract: serializedPaymentSignature.c,
      client: serializedPaymentSignature.cl
    };
  }

}

_defineProperty__default["default"](PaymentDeserializer, "serializedPaymentBase64Deserializer", new Base64Deserializer(serializedPaymentFieldTypes));

new Map() // address
.set('a', 'string') // id
.set('i', ['number', 'undefined', 'null']);

new Map() // client
.set('cl', 'string') // signature.signingPublicKey
.set('k', 'string');

const serializedDonationFieldTypes = new Map() // data
.set('d', ['object', 'undefined', 'null']) // desiredAmount
.set('da', ['string', 'undefined', 'null']) // desiredAsset
.set('das', ['object', 'undefined', 'null']) // .set('das', serializedDonationAssetFieldTypes)
// successUrl
.set('su', ['string', 'undefined', 'null']) // cancelUrl
.set('cu', ['string', 'undefined', 'null']) // signature
.set('s', ['object', 'undefined', 'null']); // .set('da', serializedDonationSignatureFieldTypes)

const serializedEmptyObjectBase64 = 'e30';
class DonationSerializer {
  serialize(donation) {
    try {
      const serializedDonation = this.mapDonationToSerializedDonation(donation);
      const serializedDonationBase64 = DonationSerializer.serializedDonationBase64Serializer.serialize(serializedDonation);
      return serializedDonationBase64 === serializedEmptyObjectBase64 ? '' : serializedDonationBase64;
    } catch {
      return null;
    }
  }

  mapDonationToSerializedDonation(donation) {
    var _donation$desiredAmou, _donation$successUrl, _donation$cancelUrl;

    return {
      d: donation.data,
      da: (_donation$desiredAmou = donation.desiredAmount) === null || _donation$desiredAmou === void 0 ? void 0 : _donation$desiredAmou.toString(),
      das: donation.desiredAsset ? this.mapDonationAssetToSerializedDonationAsset(donation.desiredAsset) : undefined,
      su: (_donation$successUrl = donation.successUrl) === null || _donation$successUrl === void 0 ? void 0 : _donation$successUrl.toString(),
      cu: (_donation$cancelUrl = donation.cancelUrl) === null || _donation$cancelUrl === void 0 ? void 0 : _donation$cancelUrl.toString(),
      s: donation.signature ? this.mapDonationSignatureToSerializedDonationSignature(donation.signature) : undefined
    };
  }

  mapDonationAssetToSerializedDonationAsset(donationAsset) {
    return {
      a: donationAsset.address,
      i: donationAsset.id !== null ? donationAsset.id : undefined
    };
  }

  mapDonationSignatureToSerializedDonationSignature(donationSignature) {
    return {
      k: donationSignature.signingPublicKey,
      cl: donationSignature.client
    };
  }

}

_defineProperty__default["default"](DonationSerializer, "serializedDonationBase64Serializer", new Base64Serializer(serializedDonationFieldTypes));

class DonationDeserializer {
  deserialize(serializedDonationBase64, nonSerializedDonationSlice) {
    try {
      const serializedDonation = DonationDeserializer.serializedDonationBase64Deserializer.deserialize(serializedDonationBase64);
      return serializedDonation ? this.mapSerializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) : null;
    } catch {
      return null;
    }
  }

  mapSerializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) {
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

  mapSerializedDonationAssetToDonationAsset(serializedDonationAsset) {
    return {
      address: serializedDonationAsset.a,
      id: serializedDonationAsset.i !== undefined ? serializedDonationAsset.i : null
    };
  }

  mapSerializedDonationSignatureToDonationSignature(serializedDonationSignature) {
    return {
      signingPublicKey: serializedDonationSignature.k,
      client: serializedDonationSignature.cl
    };
  }

}

_defineProperty__default["default"](DonationDeserializer, "serializedDonationBase64Deserializer", new Base64Deserializer(serializedDonationFieldTypes));

class Payment extends StateModel {
  static validate(payment) {
    return Payment.defaultValidator.validate(payment);
  }

  static deserialize(serializedPayment, nonSerializedPaymentSlice) {
    return Payment.defaultDeserializer.deserialize(serializedPayment, nonSerializedPaymentSlice);
  }

}

_defineProperty__default["default"](Payment, "defaultDeserializer", new PaymentDeserializer());

_defineProperty__default["default"](Payment, "defaultValidator", new PaymentValidator());

class Donation extends StateModel {
  static validate(donation) {
    return Donation.defaultValidator.validate(donation);
  }

  static deserialize(serializedDonation, nonSerializedDonationSlice) {
    return Donation.defaultDeserializer.deserialize(serializedDonation, nonSerializedDonationSlice);
  }

}

_defineProperty__default["default"](Donation, "defaultDeserializer", new DonationDeserializer());

_defineProperty__default["default"](Donation, "defaultValidator", new DonationValidator());

exports.PaymentUrlType = void 0;

(function (PaymentUrlType) {
  PaymentUrlType[PaymentUrlType["Base64"] = 0] = "Base64";
})(exports.PaymentUrlType || (exports.PaymentUrlType = {}));

const encodedPaymentUrlTypeMap = new Map(Object.keys(exports.PaymentUrlType).filter(value => !isNaN(+value)).map(value => [+value, padStart(value, 2, '0')]));
const getEncodedPaymentUrlType = paymentUrlType => encodedPaymentUrlTypeMap.get(paymentUrlType) || '';

const getParameterizedRoute = (factory, template) => {
  factory.template = template;
  return factory;
};

exports.ServiceOperationType = void 0;

(function (ServiceOperationType) {
  ServiceOperationType[ServiceOperationType["Payment"] = 1] = "Payment";
  ServiceOperationType[ServiceOperationType["Donation"] = 2] = "Donation";
  ServiceOperationType[ServiceOperationType["All"] = 3] = "All";
})(exports.ServiceOperationType || (exports.ServiceOperationType = {}));

const emptyService = {
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
  network: networks.granadanet,
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

class DonationOperation extends StateModel {
  static parsePayload(encodedValue) {
    const valueString = bytesToString(encodedValue);
    let value = null;

    try {
      value = JSON.parse(valueString);
    } catch {
      /**/
    }

    return {
      value,
      valueString,
      encodedValue
    };
  }

}

class DonationSignPayloadEncoder {
  encode(donation) {
    return {
      clientSignPayload: this.getClientSignPayload(donation)
    };
  }

  getClientSignPayload(donation) {
    return (donation.successUrl ? donation.successUrl.href : '') + (donation.cancelUrl ? donation.cancelUrl.href : '') || null;
  }

}

const contractPaymentInTezSignPayloadMichelsonType = {
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
const contractPaymentInAssetSignPayloadMichelsonType = {
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

class PaymentSignPayloadEncoder {
  encode(payment) {
    return {
      contractSignPayload: this.getContractSignPayload(payment),
      clientSignPayload: this.getClientSignPayload(payment)
    };
  }

  getContractSignPayload(payment) {
    const signPayload = payment.asset ? michelCodec.packDataBytes({
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
            int: tokensAmountToNat(payment.amount, payment.asset.decimals).toString(10)
          }, {
            string: payment.asset.address
          }]
        }]
      }, payment.asset.id !== undefined && payment.asset.id !== null ? {
        prim: 'Some',
        args: [{
          int: payment.asset.id.toString()
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
        int: tezToMutez(payment.amount).toString(10)
      }]
    }, contractPaymentInTezSignPayloadMichelsonType);
    return '0x' + signPayload.bytes;
  }

  getClientSignPayload(payment) {
    return (payment.successUrl ? payment.successUrl.href : '') + (payment.cancelUrl ? payment.cancelUrl.href : '') || null;
  }

}

_defineProperty__default["default"](PaymentSignPayloadEncoder, "contractPaymentInTezSignPayloadMichelsonType", contractPaymentInTezSignPayloadMichelsonType);

_defineProperty__default["default"](PaymentSignPayloadEncoder, "contractPaymentInAssetSignPayloadMichelsonType", contractPaymentInAssetSignPayloadMichelsonType);

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
//# sourceMappingURL=index.cjs.js.map
