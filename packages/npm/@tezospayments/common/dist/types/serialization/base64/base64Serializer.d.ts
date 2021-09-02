import type { SerializedFieldType } from './serializedFieldType';
export declare class Base64Serializer<T extends Record<string | number, unknown>> {
    private objectSerializationValidator;
    constructor(fieldTypes: ReadonlyMap<keyof T, SerializedFieldType | readonly SerializedFieldType[]>);
    serialize(value: T): string | null;
}
