import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { tezosMeta, Token, TokenFA12, TokenFA2 } from '@tezospayments/common';

import { BalancesProvider } from '../balancesProvider';

export class TezosNodeDataProvider implements BalancesProvider {
  constructor(
    private readonly tezosToolkit: TezosToolkit
  ) { }

  async getTezosBalance(address: string): Promise<BigNumber> {
    const balance = await this.tezosToolkit.tz.getBalance(address);

    return balance.div(10 ** tezosMeta.decimals);
  }

  async getTokenBalance(address: string, token: Token): Promise<BigNumber> {
    let result: BigNumber | null = null;

    switch (token.type) {
      case 'fa1.2':
        result = await this.getFA12TokenBalance(address, token);
        break;
      case 'fa2':
        result = await this.getFA2TokenBalance(address, token);
        break;
      default:
        throw new Error('Not Supported');
    }

    const divider = token.metadata ? 10 ** token.metadata.decimals : 1;

    return result.div(divider);
  }

  async getFA12TokenBalance(address: string, token: TokenFA12): Promise<BigNumber> {
    const contract = await this.tezosToolkit.contract.at(token.contractAddress);
    const result = await contract.views.getBalance?.(address).read();

    return result || 0;
  }

  async getFA2TokenBalance(address: string, token: TokenFA2): Promise<BigNumber> {
    const contract = await this.tezosToolkit.contract.at(token.contractAddress);
    const response = await contract.views?.['balance_of']?.([{ owner: address, token_id: token.id }])
      .read();

    const result = response[0].balance;

    return result || 0;
  }
}
