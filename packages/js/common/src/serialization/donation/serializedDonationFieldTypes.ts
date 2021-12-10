import { SerializedDonation, SerializedDonationAsset, SerializedDonationSignature } from '../../models';
import { SerializedFieldType } from '../base64';

const _serializedDonationAssetFieldTypes: ReadonlyMap<
  keyof SerializedDonationAsset, SerializedFieldType | readonly SerializedFieldType[]
> = new Map<keyof SerializedDonationAsset, SerializedFieldType | readonly SerializedFieldType[]>()
  // address
  .set('a', 'string')
  // id
  .set('i', ['number', 'undefined', 'null']);

const _serializedDonationSignatureFieldTypes: ReadonlyMap<
  keyof SerializedDonationSignature, SerializedFieldType | readonly SerializedFieldType[]
> = new Map<keyof SerializedDonationSignature, SerializedFieldType | readonly SerializedFieldType[]>()
  // client
  .set('cl', 'string')
  // signature.signingPublicKey
  .set('k', 'string');

export const serializedDonationFieldTypes: ReadonlyMap<
  keyof SerializedDonation, SerializedFieldType | readonly SerializedFieldType[]
> = new Map<keyof SerializedDonation, SerializedFieldType | readonly SerializedFieldType[]>()
  // data
  .set('d', ['object', 'undefined', 'null'])
  // desiredAmount
  .set('da', ['string', 'undefined', 'null'])
  // desiredAsset
  .set('das', ['object', 'undefined', 'null'])
  // .set('das', serializedDonationAssetFieldTypes)
  // successUrl
  .set('su', ['string', 'undefined', 'null'])
  // cancelUrl
  .set('cu', ['string', 'undefined', 'null'])
  // signature
  .set('s', ['object', 'undefined', 'null']);
  // .set('da', serializedDonationSignatureFieldTypes)
