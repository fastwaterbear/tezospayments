import { BigNumber } from 'bignumber.js';

import { combineClassNames, Network, tezosMeta, unknownAssetMeta, } from '@tezospayments/common';

import './TotalAmount.scss';

import { selectTokensState } from '../../../store/currentPayment/selectors';
import { BalancePure } from '../../common';
import { useAppSelector } from '../../hooks';

interface TotalAmountProps {
  assetAddress: string | undefined;
  network: Network;
  value: BigNumber;
}

export const TotalAmount = (props: TotalAmountProps) => {
  const tokens = useAppSelector(selectTokensState);
  const balances = useAppSelector(state => state.balancesState);
  const asset = props.assetAddress && tokens.get(props.assetAddress);

  const { thumbnailUri, name, symbol } = asset ? (asset.metadata || unknownAssetMeta) : tezosMeta;

  return <div className="total-amount">
    <div className="total-amount__amount-container">
      <img className="total-amount__currency-icon" src={thumbnailUri} alt="Currency" draggable="false" />
      <h1 className="total-amount__value">{props.value.toFormat()}</h1>
      <div className="total-amount__currency">
        <span className="total-amount__currency-name">{name}</span>
        <span className="total-amount__ticker">{symbol}</span>
      </div>
    </div>
    <BalancePure className={combineClassNames('total-amount__balance', { 'total-amount__balance_hidden': !balances })}
      assetAddress={props.assetAddress}
    />
  </div>;
};
