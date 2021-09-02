import { LegacySerializedDonation, SerializedDonation } from '../../models';
import { SerializedFieldType } from '../base64';
export declare const serializedDonationFieldTypes: ReadonlyMap<keyof SerializedDonation, SerializedFieldType | readonly SerializedFieldType[]>;
export declare const legacySerializedDonationFieldTypes: ReadonlyMap<keyof LegacySerializedDonation, SerializedFieldType | readonly SerializedFieldType[]>;
