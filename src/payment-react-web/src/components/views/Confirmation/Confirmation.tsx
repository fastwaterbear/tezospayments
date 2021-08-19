import { Result, Spin } from 'antd';
import React from 'react';

import { Network } from '@tezospayments/common';

import { BlockchainLinkPure } from '../../common';

interface ConfirmationProps {
  network: Network;
  operationHash: string;
}

export const Confirmation = (props: ConfirmationProps) => {
  // TODO: extract into a separate module
  const operationUrl = `https://${props.network.name === 'main' ? '' : 'edo.'}tzstats.com/${props.operationHash}`;

  return <Result
    title="Confirmation"
    icon={<Spin size="large" />}
    subTitle={<BlockchainLinkPure href={operationUrl}>{props.operationHash}</BlockchainLinkPure>}
  />;
};

export const ConfirmationPure = React.memo(Confirmation);
