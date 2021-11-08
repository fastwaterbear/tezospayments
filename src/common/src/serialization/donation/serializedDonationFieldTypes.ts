import { LegacySerializedDonation, SerializedDonation } from '../../models';
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

export const legacySerializedDonationFieldTypes: ReadonlyMap<
  keyof LegacySerializedDonation, SerializedFieldType | readonly SerializedFieldType[]
> = new Map<keyof LegacySerializedDonation, SerializedFieldType | readonly SerializedFieldType[]>()
  .set('desiredAmount', ['string', 'undefined', 'null'])
  .set('desiredAsset', ['string', 'undefined', 'null'])
  .set('successUrl', ['string', 'undefined', 'null'])
  .set('cancelUrl', ['string', 'undefined', 'null']);
