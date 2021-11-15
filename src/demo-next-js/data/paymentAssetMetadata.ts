import type { PaymentAsset } from '../../common/dist/types';

export const paymentAssetMetadata: ReadonlyMap<string, PaymentAsset> = new Map<string, PaymentAsset>()
  .set('USDS', {
    address: 'KT1PMAT81mmL6NFp9rVU3xoVzU2dRdcXt4R9',
    decimals: 6,
    id: 0
  });
