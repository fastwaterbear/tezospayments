import { Result } from 'antd';
import React from 'react';

import { Network } from '@tezospayments/common';

import { BlockchainLinkPure } from '../../common';
import { useAppContext } from '../../hooks';

interface SuccessProps {
  network: Network;
  operationHash: string;
}

export const Success = (props: SuccessProps) => {
  const appContext = useAppContext();
  const operationUrl = appContext.tezosExplorer.getOperationUrl(props.operationHash);

  return <Result
    status="success"
    title="Operation Successful"
    subTitle={<BlockchainLinkPure href={operationUrl}>{props.operationHash}</BlockchainLinkPure>}
  />;
};

export const SuccessPure = React.memo(Success);
