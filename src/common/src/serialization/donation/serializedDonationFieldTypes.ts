import { SerializedDonation } from '../../models';
import { SerializedFieldType } from '../base64';

export const serializedDonationFieldTypes: ReadonlyMap<
  keyof SerializedDonation, SerializedFieldType | readonly SerializedFieldType[]
> = new Map<keyof SerializedDonation, SerializedFieldType | readonly SerializedFieldType[]>()
  // desiredAmount
  .set('da', ['string', 'undefined', 'null'])
  // desiredAsset
  .set('das', ['string', 'undefined', 'null'])
  // successUrl
  .set('su', ['string', 'undefined', 'null'])
  // cancelUrl
  .set('cu', ['string', 'undefined', 'null'])
  // signature
  .set('s', ['object', 'undefined', 'null']);
