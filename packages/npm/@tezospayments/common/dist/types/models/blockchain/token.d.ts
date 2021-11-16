import { Network } from './network';
interface TokenBase {
    readonly network: Network;
    readonly contractAddress: string;
    readonly metadata?: TokenMetadata;
}
export interface TokenFA12 extends TokenBase {
    readonly type: 'fa1.2';
}
export interface TokenFA2 extends TokenBase {
    readonly type: 'fa2';
    readonly id: number;
}
export declare type Token = TokenFA12 | TokenFA2;
export declare type TokenMetadata = {
    readonly decimals: number;
    readonly symbol: string;
    readonly name: string;
    readonly thumbnailUri: string;
};
export declare const tezosMeta: TokenMetadata;
export declare const unknownAssetMeta: TokenMetadata;
export declare const tokenWhitelist: readonly Token[];
export declare const tokenWhitelistMap: ReadonlyMap<Network, ReadonlyMap<Token['contractAddress'], Token>>;
export {};
