import { Result, Spin } from 'antd';
import React from 'react';

import { Network } from '@tezospayments/common';

import { BlockchainLinkPure } from '../../common';
import { useAppContext } from '../../hooks';

interface ConfirmationProps {
  network: Network;
  operationHash: string;
}

export const Confirmation = (props: ConfirmationProps) => {
  const appContext = useAppContext();
  const operationUrl = appContext.tezosExplorer.getOperationUrl(props.operationHash);

  return <Result
    title="Confirmation"
    icon={<Spin size="large" />}
    subTitle={<BlockchainLinkPure href={operationUrl}>{props.operationHash}</BlockchainLinkPure>}
  />;
};

export const ConfirmationPure = React.memo(Confirmation);
