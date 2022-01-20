import { KeyPairGeneratorResult } from '../../models';
import type { KeyPairGenerator } from './keyPairGenerator';
export declare class Ed25519KeyGenerator implements KeyPairGenerator {
    private _isInitialized;
    get isInitialized(): boolean;
    generate(): KeyPairGeneratorResult;
    initialize(): Promise<void>;
    static create(): Promise<Ed25519KeyGenerator>;
}
