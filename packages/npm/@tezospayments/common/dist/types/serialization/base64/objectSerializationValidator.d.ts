import { SerializedFieldType } from './serializedFieldType';
export declare class ObjectSerializationValidator<T extends Record<string | number, unknown>> {
    protected readonly objectFieldTypes: ReadonlyMap<keyof T, SerializedFieldType | readonly SerializedFieldType[]>;
    private _minObjectFieldsCount;
    constructor(objectFieldTypes: ReadonlyMap<keyof T, SerializedFieldType | readonly SerializedFieldType[]>);
    private get minObjectFieldsCount();
    private get maxObjectFieldsCount();
    validate(value: T): value is T;
}
