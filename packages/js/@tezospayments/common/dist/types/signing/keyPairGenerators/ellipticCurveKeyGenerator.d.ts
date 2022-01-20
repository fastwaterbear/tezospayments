import { ec } from 'elliptic';
import { KeyPairGeneratorResult, KeyType } from '../../models';
import type { KeyPairGenerator } from './keyPairGenerator';
export declare class EllipticCurveKeyGenerator implements KeyPairGenerator {
    protected static readonly curveInfo: {
        readonly secp256k1: {
            readonly name: "secp256k1";
            readonly keyType: KeyType.Secp256k1;
            readonly privateKeyPrefix: Uint8Array;
            readonly publicKeyPrefix: Uint8Array;
        };
        readonly p256: {
            readonly name: "p256";
            readonly keyType: KeyType.P256;
            readonly privateKeyPrefix: Uint8Array;
            readonly publicKeyPrefix: Uint8Array;
        };
    };
    protected readonly ec: ec;
    protected readonly curveInfo: typeof EllipticCurveKeyGenerator.curveInfo[keyof typeof EllipticCurveKeyGenerator.curveInfo];
    constructor(curveName: keyof typeof EllipticCurveKeyGenerator.curveInfo);
    generate(): KeyPairGeneratorResult;
}
