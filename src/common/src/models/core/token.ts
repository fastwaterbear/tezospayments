export enum Network {
  Main = 'NetXdQprcVkpaWU',
  Florence = 'NetXxkAx4woPLyu',
  Edo2net = 'NetXSgo1ZT2DRUG',
}

export interface Token {
  network: Network;
  type: 'fa1.2' | 'fa2';
  contractAddress: string;
  fa2TokenId?: number;
  metadata?: TokenMetadata;
}

export type TokenMetadata = {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri: string;
};

export const TOKEN_WHITELIST: Token[] = [
  {
    network: Network.Main,
    type: 'fa1.2',
    contractAddress: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
    metadata: {
      decimals: 18,
      symbol: 'KUSD',
      name: 'Kolibri',
      thumbnailUri: 'https://kolibri-data.s3.amazonaws.com/logo.png',
    },
  },
  {
    network: Network.Main,
    type: 'fa2',
    contractAddress: 'KT1REEb5VxWRjcHm5GzDMwErMmNFftsE5Gpf',
    fa2TokenId: 0,
    metadata: {
      decimals: 6,
      symbol: 'USDS',
      name: 'Stably USD',
      thumbnailUri: 'https://quipuswap.com/tokens/stably.png',
    },
  }
];
