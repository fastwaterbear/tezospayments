declare type ValidBase64Format = 'base64' | 'base64url';
export declare const decode: (base64String: string, format?: ValidBase64Format) => string;
export declare const encode: (value: string, format?: ValidBase64Format) => string;
export {};
