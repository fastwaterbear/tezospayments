import { SerializedPayment, SerializedPaymentAsset, SerializedPaymentSignature } from '../../models';
import { SerializedFieldType } from '../base64';

const _serializedPaymentAssetFieldTypes: ReadonlyMap<
  keyof SerializedPaymentAsset, SerializedFieldType | readonly SerializedFieldType[]
> = new Map<keyof SerializedPaymentAsset, SerializedFieldType | readonly SerializedFieldType[]>()
  // address
  .set('a', 'string')
  // decimals
  .set('d', 'number')
  // id
  .set('i', ['number', 'undefined', 'null']);

const _serializedPaymentSignatureFieldTypes: ReadonlyMap<
  keyof SerializedPaymentSignature, SerializedFieldType | readonly SerializedFieldType[]
> = new Map<keyof SerializedPaymentSignature, SerializedFieldType | readonly SerializedFieldType[]>()
  // contract
  .set('c', 'string')
  // client
  .set('cl', ['string', 'undefined', 'null'])
  // signature.signingPublicKey
  .set('k', 'string');

export const serializedPaymentFieldTypes: ReadonlyMap<
  keyof SerializedPayment, SerializedFieldType | readonly SerializedFieldType[]
> = new Map<keyof SerializedPayment, SerializedFieldType | readonly SerializedFieldType[]>()
  // id
  .set('i', 'string')
  // amount
  .set('a', 'string')
  // target
  .set('t', 'string')
  // asset
  .set('as', ['object', 'undefined', 'null'])
  // .set('as', serializedPaymentAssetFieldTypes)
  // data
  .set('d', ['object', 'undefined', 'null'])
  // successUrl
  .set('su', ['string', 'undefined', 'null'])
  // cancelUrl
  .set('cu', ['string', 'undefined', 'null'])
  // created
  .set('c', 'number')
  // expired
  .set('e', ['number', 'undefined', 'null'])
  // signature
  .set('s', 'object');
  // .set('s', serializedPaymentSignatureFieldTypes);
