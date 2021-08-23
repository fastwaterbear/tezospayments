import { Buffer } from 'buffer';

import { ObjectSerializationValidator } from './objectSerializationValidator';
import type { SerializedFieldType } from './serializedFieldType';

export class Base64Deserializer<T extends Record<string | number, unknown>> {
  private objectSerializationValidator: ObjectSerializationValidator<T>;

  constructor(fieldTypes: ReadonlyMap<keyof T, SerializedFieldType | readonly SerializedFieldType[]>) {
    this.objectSerializationValidator = new ObjectSerializationValidator(fieldTypes);
  }

  deserialize(serializedValue: string): T | null {
    try {
      let value: T;

      if (serializedValue) {
        const serializedValueString = Buffer.from(serializedValue, 'base64').toString('utf8');
        value = JSON.parse(serializedValueString);
      }
      else
        value = {} as T;

      return this.objectSerializationValidator.validate(value)
        ? value
        : null;
    }
    catch {
      return null;
    }
  }
}
