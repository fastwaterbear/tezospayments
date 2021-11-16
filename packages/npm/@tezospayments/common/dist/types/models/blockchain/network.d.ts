declare const networksInternal: {
    readonly granadanet: {
        readonly id: "NetXz969SFaFn8k";
        readonly name: "granadanet";
    };
};
interface NetworkInternal {
    readonly id: string;
    readonly name: string;
}
declare type Networks = {
    readonly [P in keyof typeof networksInternal]: (typeof networksInternal)[P] extends NetworkInternal & {
        readonly name: P;
    } ? (typeof networksInternal)[P] : never;
};
export declare type Network = Networks[keyof Networks];
export interface CustomNetwork {
    readonly id?: string;
    readonly name: string;
}
export declare const networks: Networks;
export declare const networksCollection: {
    readonly id: "NetXz969SFaFn8k";
    readonly name: "granadanet";
}[];
export declare const networkIdRegExp: RegExp;
export declare const networkNameRegExp: RegExp;
export {};
