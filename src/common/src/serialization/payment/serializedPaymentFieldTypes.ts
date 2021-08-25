import { LegacySerializedPayment, SerializedPayment } from '../../models';
import { SerializedFieldType } from '../base64';

export const serializedPaymentFieldTypes: ReadonlyMap<
  keyof SerializedPayment, SerializedFieldType | readonly SerializedFieldType[]
> = new Map<keyof SerializedPayment, SerializedFieldType | readonly SerializedFieldType[]>()
  // amount
  .set('a', 'string')
  // data
  .set('d', 'object')
  // asset
  .set('as', ['string', 'undefined', 'null'])
  // successUrl
  .set('su', ['string', 'undefined', 'null'])
  // cancelUrl
  .set('cu', ['string', 'undefined', 'null'])
  // created
  .set('c', 'number')
  // expired
  .set('e', ['number', 'undefined', 'null']);

export const legacySerializedPaymentFieldTypes: ReadonlyMap<
  keyof LegacySerializedPayment, SerializedFieldType | readonly SerializedFieldType[]
> = new Map<keyof LegacySerializedPayment, SerializedFieldType | readonly SerializedFieldType[]>()
  .set('amount', 'string')
  .set('data', 'object')
  .set('asset', ['string', 'undefined', 'null'])
  .set('successUrl', ['string', 'undefined', 'null'])
  .set('cancelUrl', ['string', 'undefined', 'null'])
  .set('created', 'number')
  .set('expired', ['number', 'undefined', 'null']);
