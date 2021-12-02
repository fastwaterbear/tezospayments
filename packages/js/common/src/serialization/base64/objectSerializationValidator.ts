import { SerializedFieldType } from './serializedFieldType';

export class ObjectSerializationValidator<T extends Record<string | number, unknown>> {
  private _minObjectFieldsCount: number | undefined;

  constructor(
    protected readonly objectFieldTypes: ReadonlyMap<keyof T, SerializedFieldType | readonly SerializedFieldType[]>
  ) {
  }

  private get minObjectFieldsCount() {
    if (!this._minObjectFieldsCount) {
      let count = 0;
      for (const info of this.objectFieldTypes) {
        if (typeof info[1] === 'string' ? info[1] !== 'undefined' : info[1].every(type => type !== 'undefined'))
          count++;
      }

      this._minObjectFieldsCount = count;
    }

    return this._minObjectFieldsCount;
  }

  private get maxObjectFieldsCount() {
    return this.objectFieldTypes.size;
  }

  validate(value: T): value is T {
    if (!value)
      return false;

    const fieldNames = Object.getOwnPropertyNames(value) as ReadonlyArray<keyof T>;

    // Prevent the field checking if the deserializedValue has an invalid number of fields
    if (fieldNames.length < this.minObjectFieldsCount || fieldNames.length > this.maxObjectFieldsCount)
      return false;

    for (const [fieldName, expectedFieldType] of this.objectFieldTypes) {
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
