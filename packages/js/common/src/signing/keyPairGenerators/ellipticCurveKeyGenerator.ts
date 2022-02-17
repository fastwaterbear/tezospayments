import { b58cencode, prefix } from '@taquito/utils';
import elliptic from 'elliptic';

import { EncodedKeyPair, KeyPair, KeyPairGeneratorResult, KeyType } from '../../models';
import type { KeyPairGenerator } from './keyPairGenerator';

export class EllipticCurveKeyGenerator implements KeyPairGenerator {
  protected static readonly curveInfo = {
    secp256k1: {
      name: 'secp256k1',
      keyType: KeyType.Secp256k1,
      privateKeyPrefix: prefix['spsk'],
      publicKeyPrefix: prefix['sppk'],
    },
    p256: {
      name: 'p256',
      keyType: KeyType.P256,
      privateKeyPrefix: prefix['p2sk'],
      publicKeyPrefix: prefix['p2pk'],
    },
  } as const;

  protected readonly ec: elliptic.ec;
  protected readonly curveInfo: typeof EllipticCurveKeyGenerator.curveInfo[keyof typeof EllipticCurveKeyGenerator.curveInfo];

  constructor(curveName: keyof typeof EllipticCurveKeyGenerator.curveInfo) {
    this.ec = new elliptic.ec(curveName);
    this.curveInfo = EllipticCurveKeyGenerator.curveInfo[curveName];
  }

  generate(): KeyPairGeneratorResult {
    const keyPair = this.ec.genKeyPair();
    console.log(keyPair);

    const publicBasePoint = keyPair.getPublic();
    const publicPointX = publicBasePoint.getX().toArray();
    const publicPointY = publicBasePoint.getY().toArray();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const firstByte = publicPointY[publicPointY.length - 1]! % 2 ? 3 : 2;

    const privateKey = new Uint8Array(keyPair.getPrivate().toArray());
    const pad = new Array(32).fill(0);
    const publicKey = new Uint8Array([firstByte].concat(pad.concat(publicPointX).slice(-32)));

    const raw: KeyPair = {
      keyType: KeyType.P256,
      privateKey,
      publicKey,
    };

    const encoded: EncodedKeyPair = {
      keyType: this.curveInfo.keyType,
      privateKey: b58cencode(privateKey, this.curveInfo.privateKeyPrefix),
      publicKey: b58cencode(publicKey, this.curveInfo.publicKeyPrefix),
    };

    return {
      raw,
      encoded
    };
  }
}
