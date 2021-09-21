import { BigNumber } from 'bignumber.js';

import { Network, tezosMeta, tokenWhitelistMap } from '@tezospayments/common';

import './TotalAmount.scss';

interface TotalAmountProps {
  asset: string | undefined;
  network: Network;
  value: BigNumber;
}

export const TotalAmount = (props: TotalAmountProps) => {
  const asset = props.asset && tokenWhitelistMap.get(props.network)?.get(props.asset);

  const imageSrc = asset ? asset.metadata?.thumbnailUri : tezosMeta.thumbnailUri;
  const assetName = asset ? asset.metadata?.name : tezosMeta.name;
  const assetTicker = asset ? asset.metadata?.symbol : tezosMeta.symbol;

  return <div className="total-amount">
    <img className="total-amount__currency-icon" src={imageSrc} alt="Currency" draggable="false" />
    <h1 className="total-amount__value">{props.value.toFormat()}</h1>
    <div className="total-amount__currency">
      <span className="total-amount__currency-name">{assetName}</span>
      <span className="total-amount__ticker">{assetTicker}</span>
    </div>
  </div>;
};
