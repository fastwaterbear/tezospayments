import { estimateSwap, Factories, findDex, FoundDex, Token } from '@quipuswap/sdk';
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
    try {
      const fromAsset = 'tez';
      const toAsset = {
        contract: assetAddress,
        id: tokenId !== null ? tokenId : undefined,
      };

      const inputDex = await this.getDex(toAsset);

      const estimatedInputValue = await estimateSwap(
        this.tezosToolkit,
        this.factories,
        fromAsset,
        toAsset,
        { outputValue: outputAmount },
        { inputDex }
      );

      return estimatedInputValue.div(10 ** tezosMeta.decimals);
    } catch {
      return null;
    }
  }

  async getTezPriceInToken(outputAmount: BigNumber, assetAddress: string, tokenId: number | null): Promise<BigNumber | null> {
    try {
      const fromAsset = {
        contract: assetAddress,
        id: tokenId !== null ? tokenId : undefined,
      };
      const toAsset = 'tez';

      const inputDex = await this.getDex(fromAsset);

      const estimatedInputValue = await estimateSwap(
        this.tezosToolkit,
        this.factories,
        fromAsset,
        toAsset,
        { outputValue: outputAmount.multipliedBy(10 ** tezosMeta.decimals) },
        { inputDex }
      );

      return estimatedInputValue;
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
