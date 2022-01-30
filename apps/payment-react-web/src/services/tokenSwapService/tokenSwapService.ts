import {
  Asset,
  estimateSwap,
  withSlippage,
  Factories,
  findDex,
  FoundDex,
  Token,
  Dex,
  withTokenApprove
} from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { converters, Network, networks, tezosMeta, tokenWhitelistMap } from '@tezospayments/common';

export class TokenSwapService {
  private readonly factories: Factories;
  private readonly DEFAULT_SLIPPAGE_TOLERANCE = 0.005;
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

  async swapTezToToken(inputAmount: BigNumber, outputAmount: BigNumber, assetAddress: string, tokenId: number | null): Promise<TransferParams[]> {
    const fromAsset = 'tez';
    const toAsset = {
      contract: assetAddress,
      id: tokenId !== null ? tokenId : undefined,
    };
    return await this.swap(fromAsset, toAsset, inputAmount, outputAmount,);
  }

  async swapTokenToTez(inputAmount: BigNumber, outputAmount: BigNumber, assetAddress: string, tokenId: number | null): Promise<TransferParams[]> {
    const fromAsset = {
      contract: assetAddress,
      id: tokenId !== null ? tokenId : undefined,
    };
    const toAsset = 'tez';
    return await this.swap(fromAsset, toAsset, inputAmount, outputAmount);
  }

  private async swap(fromAsset: Asset, toAsset: Asset, inputAmount: BigNumber, outputAmount: BigNumber): Promise<TransferParams[]> {
    const token = this.getToken(fromAsset, toAsset);

    const dex = await this.getDex(token);
    const account = await this.tezosToolkit.wallet.pkh({ forceRefetch: true });

    const tokenInfo = this.getTokenInfo(token);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const inputDecimals = fromAsset === 'tez' ? tezosMeta.decimals : tokenInfo.metadata!.decimals;
    const inputAmountNat = converters.tokensAmountToNat(inputAmount, inputDecimals);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const outputDecimals = toAsset === 'tez' ? tezosMeta.decimals : tokenInfo.metadata!.decimals;
    const outputAmountNat = converters.tokensAmountToNat(outputAmount, outputDecimals);

    return toAsset === token
      ? [Dex.tezToTokenPayment(dex.contract, inputAmountNat, outputAmountNat, account)]
      : await withTokenApprove(
        this.tezosToolkit,
        token,
        account,
        dex.contract.address,
        inputAmountNat,
        [Dex.tokenToTezPayment(dex.contract, inputAmountNat, outputAmountNat, account)]
      );
  }

  private async getEstimatedInputValue(fromAsset: Asset, toAsset: Asset, outputAmount: BigNumber): Promise<BigNumber | null> {
    try {
      const token = this.getToken(fromAsset, toAsset);
      const tokenInfo = this.getTokenInfo(token);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const decimals = toAsset === 'tez' ? tezosMeta.decimals : tokenInfo.metadata!.decimals;
      const outputAmountNat = converters.tokensAmountToNat(outputAmount, decimals);
      const inputDex = await this.getDex(token);

      const estimatedInputValue = await estimateSwap(
        this.tezosToolkit,
        this.factories,
        fromAsset,
        toAsset,
        { outputValue: outputAmountNat },
        { inputDex }
      );

      const inputValueWithToleranceNat = withSlippage(estimatedInputValue, -this.DEFAULT_SLIPPAGE_TOLERANCE);
      return converters.numberToTokensAmount(inputValueWithToleranceNat, decimals);
    }
    catch {
      return null;
    }
  }

  private getToken(fromAsset: Asset, toAsset: Asset): Token {
    if (fromAsset !== 'tez')
      return fromAsset;
    else if (toAsset !== 'tez')
      return toAsset;
    else
      throw new Error('FA12 / FA20 Token should be passed as input or output');
  }

  private getTokenInfo(token: Token) {
    const tokenInfo = tokenWhitelistMap.get(this.network)?.get(typeof token.contract === 'string' ? token.contract : token.contract.address);
    if (!tokenInfo || !tokenInfo.metadata)
      throw new Error('Token not found');

    return tokenInfo;
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
