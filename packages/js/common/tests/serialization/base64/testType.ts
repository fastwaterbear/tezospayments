import type { SerializedFieldType } from '../../../src';

export type TestType = {
  field1: {
    x: number;
    y: number;
  };
  field2: string;
  field3: number;
  field4: string | number;
  field5: string | null;
  field6?: number;
  field7: string | undefined | null;
  field8?: {
    x: string;
    y: string;
    z: string;
  }
};

export const testTypeFieldTypes = new Map<keyof TestType, SerializedFieldType | readonly SerializedFieldType[]>()
  .set('field1', 'object')
  .set('field2', 'string')
  .set('field3', 'number')
  .set('field4', ['string', 'number'])
  .set('field5', ['string', 'null'])
  .set('field6', ['number', 'undefined', 'null'])
  .set('field7', ['string', 'undefined', 'null'])
  .set('field8', ['object', 'undefined', 'null']);
