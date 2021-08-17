import { Result, Spin } from 'antd';
import React, { useContext } from 'react';

import { Network } from '@tezospayments/common/dist/models/blockchain';

import { AppViewContext } from '../../../app';
import { BlockchainLinkPure } from '../../common';

interface ConfirmationProps {
  network: Network;
  operationHash: string;
}

export const Confirmation = (props: ConfirmationProps) => {
  const appContext = useContext(AppViewContext);
  const operationUrl = appContext.tzStatsUrlBlockchainExplorer.getOperationUrl(props.operationHash);

  return <Result
    title="Confirmation"
    icon={<Spin size="large" />}
    subTitle={<BlockchainLinkPure href={operationUrl}>{props.operationHash}</BlockchainLinkPure>}
  />;
};

export const ConfirmationPure = React.memo(Confirmation);
