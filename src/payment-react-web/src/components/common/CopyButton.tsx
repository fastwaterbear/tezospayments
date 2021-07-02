import { CopyOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';

import './CopyButton.scss';

interface CopyButtonProps {
  copyText: string;
}

export const CopyButton = (props: CopyButtonProps) => {
  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(props.copyText);
  }, [props.copyText]);

  return <button className="copy-button" onClick={handleClick}>
    <CopyOutlined className="copy-button__icon" />
  </button>;
};

export const CopyButtonPure = React.memo(CopyButton);
