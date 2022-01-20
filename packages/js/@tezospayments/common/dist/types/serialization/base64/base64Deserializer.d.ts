import type { SerializedFieldType } from './serializedFieldType';
export declare class Base64Deserializer<T extends Record<string | number, unknown>> {
    private objectSerializationValidator;
    constructor(fieldTypes: ReadonlyMap<keyof T, SerializedFieldType | readonly SerializedFieldType[]>);
    deserialize(serializedValue: string): T | null;
}
