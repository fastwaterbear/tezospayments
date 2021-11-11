import { BigNumber } from 'bignumber.js';
import { useSelector } from 'react-redux';

import { Network, tezosMeta, unknownAssetMeta, } from '@tezospayments/common';

import './TotalAmount.scss';

import { selectTokensState } from '../../../store/currentPayment/selectors';

interface TotalAmountProps {
  asset: string | undefined;
  network: Network;
  value: BigNumber;
}

export const TotalAmount = (props: TotalAmountProps) => {
  const tokens = useSelector(selectTokensState);
  const asset = props.asset && tokens.get(props.asset);

  const { thumbnailUri, name, symbol } = asset ? (asset.metadata || unknownAssetMeta) : tezosMeta;

  return <div className="total-amount">
    <img className="total-amount__currency-icon" src={thumbnailUri} alt="Currency" draggable="false" />
    <h1 className="total-amount__value">{props.value.toFormat()}</h1>
    <div className="total-amount__currency">
      <span className="total-amount__currency-name">{name}</span>
      <span className="total-amount__ticker">{symbol}</span>
    </div>
  </div>;
};
