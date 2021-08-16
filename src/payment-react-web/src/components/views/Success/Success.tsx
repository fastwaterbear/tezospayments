import { Result } from 'antd';
import React from 'react';

import { Network } from '@tezospayments/common/dist/models/blockchain';

import { BlockchainLinkPure } from '../../common';

interface SuccessProps {
  network: Network;
  operationHash: string;
}

export const Success = (props: SuccessProps) => {
  // TODO: extract into a separate module
  const operationUrl = `https://${props.network.name === 'mainnet' ? '' : 'edo.'}tzstats.com/${props.operationHash}`;

  return <Result
    status="success"
    title="Operation Successful"
    subTitle={<BlockchainLinkPure href={operationUrl}>{props.operationHash}</BlockchainLinkPure>}
  />;
};

export const SuccessPure = React.memo(Success);
