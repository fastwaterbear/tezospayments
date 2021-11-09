import { SerializedPayment } from '../../models';
import { SerializedFieldType } from '../base64';

export const serializedPaymentFieldTypes: ReadonlyMap<
  keyof SerializedPayment, SerializedFieldType | readonly SerializedFieldType[]
> = new Map<keyof SerializedPayment, SerializedFieldType | readonly SerializedFieldType[]>()
  // id
  .set('i', 'string')
  // amount
  .set('a', 'string')
  // asset
  .set('as', ['string', 'undefined', 'null'])
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
