import { Network, networks, networksCollection } from './network';

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
  readonly fa2TokenId: number;
}

export type Token = TokenFA12 | TokenFA2;

export type TokenMetadata = {
  readonly decimals: number;
  readonly symbol: string;
  readonly name: string;
  readonly thumbnailUri: string;
};

export const tezosMeta: TokenMetadata = {
  symbol: 'XTZ',
  name: 'Tezos',
  decimals: 6,
  thumbnailUri: 'https://dashboard.tezospayments.com/tokens/tezos.png'
};

export const tokenWhitelist: readonly Token[] = [
  // {
  //   network: networks.mainnet,
  //   type: 'fa1.2',
  //   contractAddress: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
  //   metadata: {
  //     decimals: 18,
  //     symbol: 'KUSD',
  //     name: 'Kolibri',
  //     thumbnailUri: 'https://kolibri-data.s3.amazonaws.com/logo.png',
  //   },
  // },
  // {
  //   network: networks.mainnet,
  //   type: 'fa2',
  //   contractAddress: 'KT1REEb5VxWRjcHm5GzDMwErMmNFftsE5Gpf',
  //   fa2TokenId: 0,
  //   metadata: {
  //     decimals: 6,
  //     symbol: 'USDS',
  //     name: 'Stably USD',
  //     thumbnailUri: 'https://quipuswap.com/tokens/stably.png',
  //   },
  // },
  {
    network: networks.granadanet,
    type: 'fa1.2',
    contractAddress: 'KT1KcuD9MmgZuGcptdD3qRqxXpGg4WxFsfVc',
    metadata: {
      decimals: 0,
      symbol: 'fa12',
      name: 'Test fa12',
      thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png',
    },
  },
  {
    network: networks.granadanet,
    type: 'fa2',
    contractAddress: 'KT1BBfxboq63dbaKCAc4uwVKLFzVn1b4fy37',
    fa2TokenId: 0,
    metadata: {
      decimals: 0,
      symbol: 'fa20',
      name: 'Test fa20',
      thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png',
    },
  },
  {
    network: networks.granadanet,
    type: 'fa2',
    contractAddress: 'KT1PMAT81mmL6NFp9rVU3xoVzU2dRdcXt4R9',
    fa2TokenId: 0,
    metadata: {
      decimals: 6,
      symbol: 'USDS',
      name: 'Stably USD',
      thumbnailUri: 'https://quipuswap.com/tokens/stably.png',
    },
  },
];


export const tokenWhitelistMap: ReadonlyMap<Network, ReadonlyMap<Token['contractAddress'], Token>> = new Map(
  networksCollection.map(nc => [nc, new Map(tokenWhitelist.filter(t => t.network === nc).map(t => [t.contractAddress, t]))])
);
