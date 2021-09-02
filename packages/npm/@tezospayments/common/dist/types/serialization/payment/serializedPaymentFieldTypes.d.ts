import { LegacySerializedPayment, SerializedPayment } from '../../models';
import { SerializedFieldType } from '../base64';
export declare const serializedPaymentFieldTypes: ReadonlyMap<keyof SerializedPayment, SerializedFieldType | readonly SerializedFieldType[]>;
export declare const legacySerializedPaymentFieldTypes: ReadonlyMap<keyof LegacySerializedPayment, SerializedFieldType | readonly SerializedFieldType[]>;
