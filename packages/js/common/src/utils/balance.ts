import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { tezosMeta, Token, TokenFA12, TokenFA2 } from '../models/blockchain';

export const getTezosBalance = async (address: string, tezosToolkit: TezosToolkit): Promise<BigNumber> => {
  const balance = await tezosToolkit.tz.getBalance(address);

  return balance.div(10 ** tezosMeta.decimals);
};

export const getTokenBalance = async (address: string, token: Token, tezosToolkit: TezosToolkit): Promise<BigNumber> => {
  let result: BigNumber | null = null;

  switch (token.type) {
    case 'fa1.2':
      result = await getFA12TokenBalance(address, token, tezosToolkit);
      break;
    case 'fa2':
      result = await getFA2TokenBalance(address, token, tezosToolkit);
      break;
    default:
      throw new Error('Not Supported');
  }

  const divider = token.metadata ? 10 ** token.metadata.decimals : 1;

  return result.div(divider);
};


const getFA12TokenBalance = async (address: string, token: TokenFA12, tezosToolkit: TezosToolkit): Promise<BigNumber> => {
  const contract = await tezosToolkit.contract.at(token.contractAddress);
  const result = await contract.views.getBalance?.(address).read();

  return result || 0;
};

const getFA2TokenBalance = async (address: string, token: TokenFA2, tezosToolkit: TezosToolkit): Promise<BigNumber> => {
  const contract = await tezosToolkit.contract.at(token.contractAddress);
  const response = await contract.views?.['balance_of']?.([{ owner: address, token_id: token.id }])
    .read();

  const result = response[0].balance;

  return result || 0;
};
