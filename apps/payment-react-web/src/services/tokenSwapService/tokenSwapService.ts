import { Asset, estimateSwap, Factories, findDex, FoundDex, Token } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Network, networks, tezosMeta } from '@tezospayments/common';

export class TokenSwapService {
  private readonly factories: Factories;
  private readonly dexByToken: Map<string, FoundDex> = new Map();

  constructor(
    private readonly network: Network,
    private readonly tezosToolkit: TezosToolkit
  ) {
    this.factories = this.createFactories(this.network);
  }

  async getTokenPriceInTez(outputAmount: BigNumber, assetAddress: string, tokenId: number | null): Promise<BigNumber | null> {
    const fromAsset = 'tez';
    const toAsset = {
      contract: assetAddress,
      id: tokenId !== null ? tokenId : undefined,
    };
    return await this.getEstimatedInputValue(fromAsset, toAsset, outputAmount);
  }

  async getTezPriceInToken(outputAmount: BigNumber, assetAddress: string, tokenId: number | null): Promise<BigNumber | null> {
    const fromAsset = {
      contract: assetAddress,
      id: tokenId !== null ? tokenId : undefined,
    };
    const toAsset = 'tez';
    return await this.getEstimatedInputValue(fromAsset, toAsset, outputAmount);
  }

  private async getEstimatedInputValue(fromAsset: Asset, toAsset: Asset, outputAmount: BigNumber): Promise<BigNumber | null> {
    try {
      const toTez = toAsset === 'tez';

      let token: Token;
      if (fromAsset !== 'tez')
        token = fromAsset;
      else if (toAsset !== 'tez')
        token = toAsset;
      else
        throw new Error('FA12 / FA20 Token should be passed as input or output');

      const inputDex = await this.getDex(token);

      const estimatedInputValue = await estimateSwap(
        this.tezosToolkit,
        this.factories,
        fromAsset,
        toAsset,
        { outputValue: toTez ? outputAmount.multipliedBy(10 ** tezosMeta.decimals) : outputAmount },
        { inputDex }
      );

      return toTez ? estimatedInputValue : estimatedInputValue.div(10 ** tezosMeta.decimals);
    }
    catch {
      return null;
    }
  }

  private createFactories(network: Network): Factories {
    switch (network) {
      case networks.mainnet:
        return {
          fa1_2Factory: 'KT1FWHLMk5tHbwuSsp31S4Jum4dTVmkXpfJw',
          fa2Factory: 'KT1PvEyN1xCFCgorN92QCfYjw3axS6jawCiJ',
        };
      case networks.hangzhounet:
        return {
          fa1_2Factory: 'KT1HrQWkSFe7ugihjoMWwQ7p8ja9e18LdUFn',
          fa2Factory: 'KT1Dx3SZ6r4h2BZNQM8xri1CtsdNcAoXLGZB',
        };

      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }

  private async getDex(token: Token): Promise<FoundDex> {
    const key = typeof token.contract === 'string' ? token.contract : token.contract.address;
    let dex = this.dexByToken.get(key);
    if (!dex) {
      dex = await findDex(this.tezosToolkit, this.factories, token);
      this.dexByToken.set(key, dex);
    }

    return dex;
  }
}
