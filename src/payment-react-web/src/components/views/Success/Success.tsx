import { Result } from 'antd';
import React from 'react';

import { Network } from '@tezos-payments/common/dist/models/blockchain';

import { ExternalLink } from '../../common';

interface SuccessProps {
  network: Network;
  operationHash: string;
}

export const Success = (props: SuccessProps) => {
  // TODO: extract into a separate module
  const operationUrl = `https://${props.network.name === 'main' ? '' : 'edo.'}tzstats.com/${props.operationHash}`;

  return <Result
    status="success"
    title="Operation Successful"
    subTitle={<ExternalLink href={operationUrl}>{props.operationHash}</ExternalLink>}
  />;
};

export const SuccessPure = React.memo(Success);
