'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var clsx = require('clsx');
var buffer = require('buffer');
var isPlainObjectLodashFunction = require('lodash.isplainobject');
var BigNumber = require('bignumber.js');
var url = require('url');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var clsx__default = /*#__PURE__*/_interopDefaultLegacy(clsx);
var isPlainObjectLodashFunction__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObjectLodashFunction);
var BigNumber__default = /*#__PURE__*/_interopDefaultLegacy(BigNumber);

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

const isArray = arg => {
  return Array.isArray(arg);
};
const isReadonlyArray = arg => {
  return Array.isArray(arg);
};
const isPlainObject = value => {
  return isPlainObjectLodashFunction__default['default'](value);
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
var optimization = {
  emptyArray,
  emptyMap,
  emptySet,
  emptyObject
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

_defineProperty__default['default'](ServiceLinkHelper, "linkInfoProviders", [// Disallowed
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
  },
  edo2net: {
    id: 'NetXSgo1ZT2DRUG',
    name: 'edo2net'
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
const tokenWhitelistMap = new Map(tokenWhitelist.map(token => [token.contractAddress, token]));

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
  if (!BigNumber__default['default'].isBigNumber(amount) || amount.isNaN() || !amount.isFinite()) return [errors.invalidAmount];
  if (amount.isZero() || amount.isNegative()) return [errors.amountIsNonPositive];
};
const validateDesiredAmount = (desiredAmount, errors) => {
  return desiredAmount === undefined ? undefined : validateAmount(desiredAmount, errors);
};
const validateAsset = (asset, errors) => {
  if (asset === undefined) return;
  if (typeof asset !== 'string') return [errors.invalidAsset];
  if (asset.length !== tezosInfo.addressLength) return [errors.assetHasInvalidLength];
  if (!tezosInfo.contractAddressPrefixes.some(prefix => asset.startsWith(prefix))) return [errors.assetIsNotContractAddress];
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
  if (!isPlainObject(data) || Object.keys(data).some(key => key !== 'public' && key !== 'private')) return [errors.invalidData];
  const publicData = data.public;
  const privateData = data.private;
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

const isFlatObject = obj => {
  for (const propertyName of Object.getOwnPropertyNames(obj)) {
    const property = obj[propertyName];
    if (typeof property === 'object' || typeof property === 'function') return false;
  }

  return true;
};

class PaymentValidator extends PaymentValidatorBase {
  constructor(...args) {
    super(...args);

    _defineProperty__default['default'](this, "validationMethods", [payment => payment.type !== exports.PaymentType.Payment ? [PaymentValidator.errors.invalidType] : undefined, payment => validateTargetAddress(payment.targetAddress, PaymentValidator.errors), payment => validateId(payment.id, PaymentValidator.errors), payment => validateAmount(payment.amount, PaymentValidator.errors), payment => validateData(payment.data, PaymentValidator.errors), payment => validateAsset(payment.asset, PaymentValidator.errors), payment => validateUrl(payment.successUrl, PaymentValidator.successUrlErrors), payment => validateUrl(payment.cancelUrl, PaymentValidator.cancelUrlErrors), payment => validateCreatedDate(payment.created, PaymentValidator.errors), payment => validateExpiredDate(payment.expired, payment.created, PaymentValidator.minimumPaymentLifetime, PaymentValidator.errors)]);

    _defineProperty__default['default'](this, "invalidPaymentObjectError", PaymentValidator.errors.invalidPaymentObject);
  }

}

_defineProperty__default['default'](PaymentValidator, "errors", {
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

_defineProperty__default['default'](PaymentValidator, "minimumPaymentLifetime", 600000);

_defineProperty__default['default'](PaymentValidator, "successUrlErrors", {
  invalidUrl: PaymentValidator.errors.invalidSuccessUrl,
  invalidProtocol: PaymentValidator.errors.successUrlHasInvalidProtocol
});

_defineProperty__default['default'](PaymentValidator, "cancelUrlErrors", {
  invalidUrl: PaymentValidator.errors.invalidCancelUrl,
  invalidProtocol: PaymentValidator.errors.cancelUrlHasInvalidProtocol
});

class DonationValidator extends PaymentValidatorBase {
  constructor(...args) {
    super(...args);

    _defineProperty__default['default'](this, "validationMethods", [donation => donation.type !== exports.PaymentType.Donation ? [DonationValidator.errors.invalidType] : undefined, donation => validateTargetAddress(donation.targetAddress, DonationValidator.errors), donation => validateDesiredAmount(donation.desiredAmount, DonationValidator.errors), donation => validateAsset(donation.desiredAsset, DonationValidator.errors), donation => validateUrl(donation.successUrl, DonationValidator.successUrlErrors), donation => validateUrl(donation.cancelUrl, DonationValidator.cancelUrlErrors)]);

    _defineProperty__default['default'](this, "invalidPaymentObjectError", DonationValidator.errors.invalidDonationObject);
  }

}

_defineProperty__default['default'](DonationValidator, "errors", {
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

_defineProperty__default['default'](DonationValidator, "successUrlErrors", {
  invalidUrl: DonationValidator.errors.invalidSuccessUrl,
  invalidProtocol: DonationValidator.errors.successUrlHasInvalidProtocol
});

_defineProperty__default['default'](DonationValidator, "cancelUrlErrors", {
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

const serializedPaymentFieldTypes = new Map() // id
.set('i', 'string') // amount
.set('a', 'string') // data
.set('d', 'object') // asset
.set('as', ['string', 'undefined', 'null']) // successUrl
.set('su', ['string', 'undefined', 'null']) // cancelUrl
.set('cu', ['string', 'undefined', 'null']) // created
.set('c', 'number') // expired
.set('e', ['number', 'undefined', 'null']);
const legacySerializedPaymentFieldTypes = new Map().set('amount', 'string').set('data', 'object').set('asset', ['string', 'undefined', 'null']).set('successUrl', ['string', 'undefined', 'null']).set('cancelUrl', ['string', 'undefined', 'null']).set('created', 'number').set('expired', ['number', 'undefined', 'null']);

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
      d: payment.data,
      as: payment.asset,
      su: (_payment$successUrl = payment.successUrl) === null || _payment$successUrl === void 0 ? void 0 : _payment$successUrl.toString(),
      cu: (_payment$cancelUrl = payment.cancelUrl) === null || _payment$cancelUrl === void 0 ? void 0 : _payment$cancelUrl.toString(),
      c: payment.created.getTime(),
      e: (_payment$expired = payment.expired) === null || _payment$expired === void 0 ? void 0 : _payment$expired.getTime()
    };
  }

}

_defineProperty__default['default'](PaymentSerializer, "serializedPaymentBase64Serializer", new Base64Serializer(serializedPaymentFieldTypes));

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
      amount: new BigNumber__default['default'](serializedPayment.a),
      data: serializedPayment.d,
      asset: serializedPayment.as,
      successUrl: serializedPayment.su ? new URL(serializedPayment.su) : undefined,
      cancelUrl: serializedPayment.cu ? new URL(serializedPayment.cu) : undefined,
      created: new Date(serializedPayment.c),
      expired: serializedPayment.e ? new Date(serializedPayment.e) : undefined,
      targetAddress: nonSerializedPaymentSlice.targetAddress
    };
  }

}

_defineProperty__default['default'](PaymentDeserializer, "serializedPaymentBase64Deserializer", new Base64Deserializer(serializedPaymentFieldTypes));

class LegacyPaymentDeserializer {
  deserialize(serializedPaymentBase64, nonSerializedPaymentSlice) {
    try {
      const serializedPayment = LegacyPaymentDeserializer.serializedPaymentBase64Deserializer.deserialize(serializedPaymentBase64);
      return serializedPayment ? this.mapSerializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) : null;
    } catch {
      return null;
    }
  }

  mapSerializedPaymentToPayment(serializedPayment, nonSerializedPaymentSlice) {
    return {
      type: exports.PaymentType.Payment,
      id: 'legacy-payment',
      amount: new BigNumber__default['default'](serializedPayment.amount),
      data: serializedPayment.data,
      asset: serializedPayment.asset,
      successUrl: serializedPayment.successUrl ? new URL(serializedPayment.successUrl) : undefined,
      cancelUrl: serializedPayment.cancelUrl ? new URL(serializedPayment.cancelUrl) : undefined,
      created: new Date(serializedPayment.created),
      expired: serializedPayment.expired ? new Date(serializedPayment.expired) : undefined,
      targetAddress: nonSerializedPaymentSlice.targetAddress
    };
  }

}

_defineProperty__default['default'](LegacyPaymentDeserializer, "serializedPaymentBase64Deserializer", new Base64Deserializer(legacySerializedPaymentFieldTypes));

const serializedDonationFieldTypes = new Map() // desiredAmount
.set('da', ['string', 'undefined', 'null']) // desiredAsset
.set('das', ['string', 'undefined', 'null']) // successUrl
.set('su', ['string', 'undefined', 'null']) // cancelUrl
.set('cu', ['string', 'undefined', 'null']);
const legacySerializedDonationFieldTypes = new Map().set('desiredAmount', ['string', 'undefined', 'null']).set('desiredAsset', ['string', 'undefined', 'null']).set('successUrl', ['string', 'undefined', 'null']).set('cancelUrl', ['string', 'undefined', 'null']);

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
      da: (_donation$desiredAmou = donation.desiredAmount) === null || _donation$desiredAmou === void 0 ? void 0 : _donation$desiredAmou.toString(),
      das: donation.desiredAsset,
      su: (_donation$successUrl = donation.successUrl) === null || _donation$successUrl === void 0 ? void 0 : _donation$successUrl.toString(),
      cu: (_donation$cancelUrl = donation.cancelUrl) === null || _donation$cancelUrl === void 0 ? void 0 : _donation$cancelUrl.toString()
    };
  }

}

_defineProperty__default['default'](DonationSerializer, "serializedDonationBase64Serializer", new Base64Serializer(serializedDonationFieldTypes));

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
      desiredAmount: serializedDonation.da ? new BigNumber__default['default'](serializedDonation.da) : undefined,
      desiredAsset: serializedDonation.das,
      successUrl: serializedDonation.su ? new URL(serializedDonation.su) : undefined,
      cancelUrl: serializedDonation.cu ? new URL(serializedDonation.cu) : undefined,
      targetAddress: nonSerializedDonationSlice.targetAddress
    };
  }

}

_defineProperty__default['default'](DonationDeserializer, "serializedDonationBase64Deserializer", new Base64Deserializer(serializedDonationFieldTypes));

class LegacyDonationDeserializer {
  deserialize(serializedDonationBase64, nonSerializedDonationSlice) {
    try {
      const serializedDonation = LegacyDonationDeserializer.serializedDonationBase64Deserializer.deserialize(serializedDonationBase64);
      return serializedDonation ? this.mapSerializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) : null;
    } catch {
      return null;
    }
  }

  mapSerializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) {
    return {
      type: exports.PaymentType.Donation,
      desiredAmount: serializedDonation.desiredAmount ? new BigNumber__default['default'](serializedDonation.desiredAmount) : undefined,
      desiredAsset: serializedDonation.desiredAsset,
      successUrl: serializedDonation.successUrl ? new URL(serializedDonation.successUrl) : undefined,
      cancelUrl: serializedDonation.cancelUrl ? new URL(serializedDonation.cancelUrl) : undefined,
      targetAddress: nonSerializedDonationSlice.targetAddress
    };
  }

}

_defineProperty__default['default'](LegacyDonationDeserializer, "serializedDonationBase64Deserializer", new Base64Deserializer(legacySerializedDonationFieldTypes));

class Payment extends StateModel {
  static validate(payment) {
    return this.defaultValidator.validate(payment);
  }

  static deserialize(serializedPayment, nonSerializedPaymentSlice, isLegacy = false) {
    return !isLegacy ? Payment.defaultDeserializer.deserialize(serializedPayment, nonSerializedPaymentSlice) : Payment.defaultLegacyDeserializer.deserialize(serializedPayment, nonSerializedPaymentSlice);
  }

  static publicDataExists(paymentOrPaymentDataOrPaymentData) {
    return this.publicDataExistsInternal(paymentOrPaymentDataOrPaymentData);
  }

  static privateDataExists(payment) {
    return !!payment.data.private;
  }

  static publicDataExistsInternal(paymentOrPaymentDataOrPaymentData) {
    return !!(Payment.isPayment(paymentOrPaymentDataOrPaymentData) ? paymentOrPaymentDataOrPaymentData.data.public : paymentOrPaymentDataOrPaymentData.public);
  }

  static isPayment(paymentOrPaymentDataOrPaymentData) {
    return !!paymentOrPaymentDataOrPaymentData.amount;
  }

}

_defineProperty__default['default'](Payment, "defaultDeserializer", new PaymentDeserializer());

_defineProperty__default['default'](Payment, "defaultLegacyDeserializer", new LegacyPaymentDeserializer());

_defineProperty__default['default'](Payment, "defaultValidator", new PaymentValidator());

class Donation extends StateModel {
  static validate(donation) {
    return this.defaultValidator.validate(donation);
  }

  static deserialize(serializedDonation, nonSerializedDonationSlice, isLegacy = false) {
    return !isLegacy ? Donation.defaultDeserializer.deserialize(serializedDonation, nonSerializedDonationSlice) : Donation.defaultLegacyDeserializer.deserialize(serializedDonation, nonSerializedDonationSlice);
  }

}

_defineProperty__default['default'](Donation, "defaultDeserializer", new DonationDeserializer());

_defineProperty__default['default'](Donation, "defaultLegacyDeserializer", new LegacyDonationDeserializer());

_defineProperty__default['default'](Donation, "defaultValidator", new DonationValidator());

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
  links: [],
  version: 0,
  metadata: '',
  contractAddress: '',
  allowedTokens: {
    tez: true,
    assets: []
  },
  allowedOperationType: exports.ServiceOperationType.Payment,
  owner: '',
  paused: false,
  deleted: false,
  network: networks.edo2net,
  signingKeys: {}
};

class ServiceOperation extends StateModel {
  static publicPayloadExists(operation) {
    return !!operation.payload.public;
  }

  static privatePayloadExists(operation) {
    return !!operation.payload.private;
  }

  static isPayloadDecoded(data) {
    return !!data.value;
  }

  static parseServiceOperationPayload(encodedValue) {
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

exports.ServiceOperationDirection = void 0;

(function (ServiceOperationDirection) {
  ServiceOperationDirection[ServiceOperationDirection["Incoming"] = 0] = "Incoming";
  ServiceOperationDirection[ServiceOperationDirection["Outgoing"] = 1] = "Outgoing";
})(exports.ServiceOperationDirection || (exports.ServiceOperationDirection = {}));

exports.ServiceOperationStatus = void 0;

(function (ServiceOperationStatus) {
  ServiceOperationStatus[ServiceOperationStatus["Pending"] = 0] = "Pending";
  ServiceOperationStatus[ServiceOperationStatus["Success"] = 1] = "Success";
  ServiceOperationStatus[ServiceOperationStatus["Cancelled"] = 2] = "Cancelled";
})(exports.ServiceOperationStatus || (exports.ServiceOperationStatus = {}));

Object.defineProperty(exports, 'combineClassNames', {
  enumerable: true,
  get: function () {
    return clsx__default['default'];
  }
});
exports.Base64Deserializer = Base64Deserializer;
exports.Base64Serializer = Base64Serializer;
exports.Donation = Donation;
exports.DonationDeserializer = DonationDeserializer;
exports.DonationSerializer = DonationSerializer;
exports.DonationValidator = DonationValidator;
exports.LegacyDonationDeserializer = LegacyDonationDeserializer;
exports.LegacyPaymentDeserializer = LegacyPaymentDeserializer;
exports.Payment = Payment;
exports.PaymentDeserializer = PaymentDeserializer;
exports.PaymentSerializer = PaymentSerializer;
exports.PaymentValidator = PaymentValidator;
exports.ServiceLinkHelper = ServiceLinkHelper;
exports.ServiceOperation = ServiceOperation;
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
exports.wait = wait;
//# sourceMappingURL=index.cjs.js.map