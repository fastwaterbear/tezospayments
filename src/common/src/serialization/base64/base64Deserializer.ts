import { Buffer } from 'buffer';

import type { SerializedFieldType } from './serializedFieldType';

export class Base64Deserializer<T extends Record<string | number, unknown>> {
  private _minFieldsCount: number | undefined;

  constructor(
    protected readonly fieldTypes: ReadonlyMap<keyof T, SerializedFieldType | readonly SerializedFieldType[]>
  ) {
  }

  private get minFieldsCount() {
    if (!this._minFieldsCount) {
      let count = 0;
      for (const info of this.fieldTypes) {
        if (typeof info[1] === 'string' ? info[1] !== 'undefined' : info[1].every(type => type !== 'undefined'))
          count++;
      }

      this._minFieldsCount = count;
    }

    return this._minFieldsCount;
  }

  private get maxFieldsCount() {
    return this.fieldTypes.size;
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

      return this.validateDeserializedValue(value)
        ? value
        : null;
    }
    catch {
      return null;
    }
  }

  private validateDeserializedValue(value: T): value is T {
    const fieldNames = Object.getOwnPropertyNames(value) as ReadonlyArray<keyof T>;

    // Prevent the field checking if the deserializedValue has an invalid number of fields
    if (fieldNames.length < this.minFieldsCount || fieldNames.length > this.maxFieldsCount)
      return false;

    for (const [fieldName, expectedFieldType] of this.fieldTypes) {
      const fieldValue = value[fieldName];
      const actualFieldType = fieldValue === null ? 'null' : typeof fieldValue;

      if (Array.isArray(expectedFieldType)
        ? !expectedFieldType.some(expectedType => actualFieldType === expectedType)
        : actualFieldType !== expectedFieldType
      ) {
        return false;
      }
    }

    return true;
  }
}
