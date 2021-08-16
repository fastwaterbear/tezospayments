import { Result } from 'antd';
import React, { useContext } from 'react';

import { Network } from '@tezospayments/common/dist/models/blockchain';

import { AppViewContext } from '../../../app';
import { BlockchainLinkPure } from '../../common';

interface SuccessProps {
  network: Network;
  operationHash: string;
}

export const Success = (props: SuccessProps) => {
  const appContext = useContext(AppViewContext);
  const operationUrl = appContext.tzStatsUrlBlockchainExplorer.getOperationUrl(props.operationHash);

  return <Result
    status="success"
    title="Operation Successful"
    subTitle={<BlockchainLinkPure href={operationUrl}>{props.operationHash}</BlockchainLinkPure>}
  />;
};

export const SuccessPure = React.memo(Success);
