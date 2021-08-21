export declare const stringToUint8Array: (hex: string) => Uint8Array;
export declare const stringToBytes: (value: string) => string;
export declare const bytesToString: (value: string) => string;
export declare const objectToBytes: (value: Record<string, unknown>) => string;
export declare const bytesToObject: <T extends Record<string, unknown> = Record<string, unknown>>(value: string) => T | null;
export declare function tezToMutez(tez: number): number;
export declare function tezToMutez(tez: bigint): bigint;
