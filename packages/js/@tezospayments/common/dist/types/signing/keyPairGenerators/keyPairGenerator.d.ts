import { KeyPairGeneratorResult } from '../../models';
export interface KeyPairGenerator {
    generate(): KeyPairGeneratorResult | Promise<KeyPairGeneratorResult>;
}
