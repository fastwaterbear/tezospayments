import { Buffer } from 'buffer';

export const stringToUint8Array = (hex: string): Uint8Array => {
  const integers = hex.match(/[\da-f]{2}/gi)?.map(val => parseInt(val, 16));

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return new Uint8Array(integers!);
};

export const stringToBytes = (value: string): string => Buffer.from(value, 'utf8').toString('hex');
export const bytesToString = (value: string): string => Buffer.from(stringToUint8Array(value)).toString('utf8');

export const objectToBytes = (value: Record<string, unknown>): string => stringToBytes(JSON.stringify(value));
export const bytesToObject = <T extends Record<string, unknown> = Record<string, unknown>>(value: string): T | null => {
  try {
    return JSON.parse(bytesToString(value));
  }
  catch {
    return null;
  }
};

export function tezToMutez(tez: number): number;
export function tezToMutez(tez: bigint): bigint;
export function tezToMutez(tez: bigint | number): bigint | number {
  return typeof tez === 'number'
    ? tez * 1000000
    : tez * BigInt(1000000);
}
