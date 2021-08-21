import _defineProperty from '@babel/runtime/helpers/defineProperty';
export { default as combineClassNames } from 'clsx';
import { Buffer } from 'buffer';
import isPlainObjectLodashFunction from 'lodash.isplainobject';
import { BigNumber } from 'bignumber.js';
import { URL as URL$1 } from 'url';

const stringToUint8Array = hex => {
  var _hex$match;

  const integers = (_hex$match = hex.match(/[\da-f]{2}/gi)) === null || _hex$match === void 0 ? void 0 : _hex$match.map(val => parseInt(val, 16)); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

  return new Uint8Array(integers);
};
const stringToBytes = value => Buffer.from(value, 'utf8').toString('hex');
const bytesToString = value => Buffer.from(stringToUint8Array(value)).toString('utf8');
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
  return isPlainObjectLodashFunction(value);
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
  return x === y ? x !== 0 || y !== 0 || 1 / x === 1 / y : x !== x && y !== y;
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

var text = /*#__PURE__*/Object.freeze({
  __proto__: null,
  capitalize: capitalize,
  getAvatarText: getAvatarText
});

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

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

const getInvalidLinkInfo = link => ({
  rawLink: link,
  formattedLink: '#',
  displayLink: 'Invalid Link',
  icon: IconId.Common
});

const prepareFormattedLink = memoize(link => link.trim());
const prepareDisplayLink = memoize(link => link.trim().replace(/\/$/, ''));

const socialMediaLinkInfoProvider = (link, baseUrl, icon) => {
  if (!link.startsWith(baseUrl)) return false;
  const formattedLink = prepareFormattedLink(link);
  if (formattedLink == baseUrl) return false;
  return {
    rawLink: link,
    formattedLink,
    displayLink: prepareDisplayLink(link).replace(baseUrl, ''),
    icon
  };
};

const telegramLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://t.me/', IconId.Telegram);

const facebookLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://facebook.com/', IconId.Facebook);

const twitterLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://twitter.com/', IconId.Twitter);

const instagramLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://instagram.com/', IconId.Instagram);

const gitHubLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://github.com/', IconId.GitHub);

const redditLinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://www.reddit.com/', IconId.Reddit); // This regex should not use for email validation


const emailCheckingRegEx = /^[^\s/@]+@[^\s@/]+$/;

const emailLinkInfoProvider = link => {
  const preparedFormattedLink = prepareFormattedLink(link);
  return emailCheckingRegEx.test(preparedFormattedLink) && {
    rawLink: link,
    formattedLink: `mailto:${preparedFormattedLink}`,
    displayLink: prepareDisplayLink(link),
    icon: IconId.Email
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
    icon: IconId.Common
  };
};

const editLinkInfoProvider = link => {
  const formattedLink = prepareFormattedLink(link);
  return {
    rawLink: link,
    formattedLink,
    displayLink: prepareDisplayLink(link),
    icon: IconId.Common
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

_defineProperty(ServiceLinkHelper, "linkInfoProviders", [// Disallowed
javascriptLinkInfoProvider, // Allowed
telegramLinkInfoProvider, facebookLinkInfoProvider, twitterLinkInfoProvider, instagramLinkInfoProvider, gitHubLinkInfoProvider, emailLinkInfoProvider, redditLinkInfoProvider, commonLinkInfoProvider]);

var PaymentType;

(function (PaymentType) {
  PaymentType[PaymentType["Payment"] = 1] = "Payment";
  PaymentType[PaymentType["Donation"] = 2] = "Donation";
})(PaymentType || (PaymentType = {}));

/* eslint-disable @typescript-eslint/no-explicit-any */
const URL = URL$1 || globalThis.URL;

class PaymentParserBase {
  get minPaymentFieldsCount() {
    if (!this._minPaymentFieldsCount) {
      let count = 0;

      for (const info of this.paymentFieldTypes) {
        if (typeof info[1] === 'string' ? info[1] !== 'undefined' : info[1].every(type => type !== 'undefined')) count++;
      }

      this._minPaymentFieldsCount = count;
    }

    return this._minPaymentFieldsCount;
  }

  get maxPaymentFieldsCount() {
    return this.paymentFieldTypes.size;
  }

  parse(paymentBase64, nonIncludedFields) {
    try {
      let rawPayment;

      if (paymentBase64) {
        const paymentString = Buffer.from(paymentBase64, 'base64').toString('utf8');
        rawPayment = JSON.parse(paymentString);
      } else rawPayment = {};

      return this.validateAndMapRawPaymentToPayment(rawPayment, nonIncludedFields);
    } catch {
      return null;
    }
  }

  validateAndMapRawPaymentToPayment(rawPayment, nonIncludedFields) {
    return this.validateRawPayment(rawPayment) ? this.mapRawPaymentToPayment(rawPayment, nonIncludedFields) : null;
  }

  validateRawPayment(rawPayment) {
    const rawPaymentFieldNames = Object.getOwnPropertyNames(rawPayment); // Prevent the field checking if the rawPayment has an invalid number of fields

    if (rawPaymentFieldNames.length < this.minPaymentFieldsCount || rawPaymentFieldNames.length > this.maxPaymentFieldsCount) return false;

    for (const [rawPaymentFieldName, expectedPaymentFieldType] of this.paymentFieldTypes) {
      const actualPaymentFieldType = typeof rawPayment[rawPaymentFieldName];

      if (Array.isArray(expectedPaymentFieldType) ? !expectedPaymentFieldType.some(expectedType => actualPaymentFieldType === expectedType) : actualPaymentFieldType !== expectedPaymentFieldType) {
        return false;
      }
    }

    return true;
  }

}

class PaymentParser extends PaymentParserBase {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_paymentFieldTypes", new Map().set('amount', 'string').set('data', 'object').set('asset', ['string', 'undefined', 'null']).set('successUrl', ['string', 'undefined', 'null']).set('cancelUrl', ['string', 'undefined', 'null']).set('created', 'number').set('expired', ['number', 'undefined', 'null']));
  }

  get paymentFieldTypes() {
    return this._paymentFieldTypes;
  }

  mapRawPaymentToPayment(rawPayment, nonIncludedFields) {
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

}

class DonationParser extends PaymentParserBase {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_paymentFieldTypes", new Map().set('desiredAmount', ['string', 'undefined', 'null']).set('desiredAsset', ['string', 'undefined', 'null']).set('successUrl', ['string', 'undefined', 'null']).set('cancelUrl', ['string', 'undefined', 'null']));
  }

  get paymentFieldTypes() {
    return this._paymentFieldTypes;
  }

  mapRawPaymentToPayment(rawDonation, nonIncludedFields) {
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

}

class PaymentValidatorBase {
  validate(payment, bail = false) {
    if (!isPlainObject(payment)) return [this.invalidPaymentObjectError];
    const failedValidationResults = bail ? [] : undefined;

    for (const validationMethod of this.validationMethods) {
      const currentFailedValidationResults = validationMethod(payment);

      if (currentFailedValidationResults) {
        if (!bail) return currentFailedValidationResults; // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

        failedValidationResults.concat(currentFailedValidationResults);
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

const tezosMeta = {
  symbol: 'XTZ',
  name: 'Tezos',
  decimals: 6,
  // eslint-disable-next-line max-len
  thumbnailUri: 'data:image/png;base64,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'
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
    thumbnailUri: 'https://quipuswap.com/tokens/stably.png'
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

const validateTargetAddress = (targetAddress, errors) => {
  if (typeof targetAddress !== 'string') return [errors.invalidTargetAddress];
  if (targetAddress.length !== tezosInfo.addressLength) return [errors.targetAddressHasInvalidLength];
  if (!tezosInfo.addressPrefixes.some(prefix => targetAddress.startsWith(prefix))) return [errors.targetAddressIsNotNetworkAddress];
};
const validateAmount = (amount, errors) => {
  if (!BigNumber.isBigNumber(amount) || amount.isNaN() || !amount.isFinite()) return [errors.invalidAmount];
  if (amount.isNegative()) return [errors.amountIsNegative];
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
  if (!(date instanceof Date)) return [errors.invalidCreatedDate];
};
const validateUrl = (url, errors) => {
  if (url === undefined) return;
  if (!(url instanceof URL)) return [errors.invalidUrl];
  if (url.protocol.indexOf('javascript') > -1) return [errors.invalidProtocol];
};
const validateExpiredDate = (expiredDate, createdDate, minimumPaymentLifetime, errors) => {
  if (expiredDate === undefined) return;
  if (!(expiredDate instanceof Date)) return [errors.invalidExpiredDate];

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

    _defineProperty(this, "validationMethods", [payment => payment.type !== PaymentType.Payment ? [PaymentValidator.errors.invalidType] : undefined, payment => validateTargetAddress(payment.targetAddress, PaymentValidator.errors), payment => validateAmount(payment.amount, PaymentValidator.errors), payment => validateData(payment.data, PaymentValidator.errors), payment => validateAsset(payment.asset, PaymentValidator.errors), payment => validateUrl(payment.successUrl, PaymentValidator.successUrlErrors), payment => validateUrl(payment.cancelUrl, PaymentValidator.cancelUrlErrors), payment => validateCreatedDate(payment.created, PaymentValidator.errors), payment => validateExpiredDate(payment.expired, payment.created, PaymentValidator.minimumPaymentLifetime, PaymentValidator.errors)]);

    _defineProperty(this, "invalidPaymentObjectError", PaymentValidator.errors.invalidPaymentObject);
  }

}

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

class DonationValidator extends PaymentValidatorBase {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "validationMethods", [donation => donation.type !== PaymentType.Donation ? [DonationValidator.errors.invalidType] : undefined, donation => validateTargetAddress(donation.targetAddress, DonationValidator.errors), donation => validateDesiredAmount(donation.desiredAmount, DonationValidator.errors), donation => validateAsset(donation.desiredAsset, DonationValidator.errors), donation => validateUrl(donation.successUrl, DonationValidator.successUrlErrors), donation => validateUrl(donation.cancelUrl, DonationValidator.cancelUrlErrors)]);

    _defineProperty(this, "invalidPaymentObjectError", DonationValidator.errors.invalidDonationObject);
  }

}

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

class StateModel {
  constructor() {// All derived classes should be static
  }

}

class Payment extends StateModel {
  static validate(payment) {
    return this.defaultValidator.validate(payment);
  }

  static parse(payment64, nonIncludedFields, parser = Payment.defaultParser) {
    return parser.parse(payment64, nonIncludedFields);
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

_defineProperty(Payment, "defaultParser", new PaymentParser());

_defineProperty(Payment, "defaultValidator", new PaymentValidator());

class Donation extends StateModel {
  static validate(donation) {
    return this.defaultValidator.validate(donation);
  }

  static parse(donationBase64, nonIncludedFields, parser = Donation.defaultParser) {
    return parser.parse(donationBase64, nonIncludedFields);
  }

}

_defineProperty(Donation, "defaultParser", new DonationParser());

_defineProperty(Donation, "defaultValidator", new DonationValidator());

const getParameterizedRoute = (factory, template) => {
  factory.template = template;
  return factory;
};

var ServiceOperationType;

(function (ServiceOperationType) {
  ServiceOperationType[ServiceOperationType["Payment"] = 1] = "Payment";
  ServiceOperationType[ServiceOperationType["Donation"] = 2] = "Donation";
  ServiceOperationType[ServiceOperationType["All"] = 3] = "All";
})(ServiceOperationType || (ServiceOperationType = {}));

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
  allowedOperationType: ServiceOperationType.Payment,
  owner: '',
  paused: false,
  deleted: false,
  network: networks.edo2net
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
//# sourceMappingURL=index.mjs.map
