import { Network, networks } from './network';

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
    network: networks.edo2net,
    type: 'fa2',
    contractAddress: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
    fa2TokenId: 0,
    metadata: {
      decimals: 0,
      symbol: 'MBRG',
      name: 'MAX BURGER',
      thumbnailUri: 'https://dashboard.tezospayments.com/tokens/unknown.png',
    },
  }
];

export const tokenWhitelistMap: ReadonlyMap<Token['contractAddress'], Token> = new Map<Token['contractAddress'], Token>(
  tokenWhitelist.map(token => [token.contractAddress, token])
);
