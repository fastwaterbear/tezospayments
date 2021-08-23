import { Buffer } from 'buffer';

import { base64 } from '../../utils';
import { ObjectSerializationValidator } from './objectSerializationValidator';
import type { SerializedFieldType } from './serializedFieldType';

export class Base64Serializer<T extends Record<string | number, unknown>> {
  private objectSerializationValidator: ObjectSerializationValidator<T>;

  constructor(fieldTypes: ReadonlyMap<keyof T, SerializedFieldType | readonly SerializedFieldType[]>) {
    this.objectSerializationValidator = new ObjectSerializationValidator(fieldTypes);
  }

  serialize(value: T): string | null {
    try {
      if (!this.objectSerializationValidator.validate(value))
        return null;

      const jsonString = JSON.stringify(value);
      return base64.encode(jsonString, 'base64url');
    }
    catch {
      return null;
    }
  }
}
