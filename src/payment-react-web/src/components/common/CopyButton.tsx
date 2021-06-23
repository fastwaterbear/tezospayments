import { CopyOutlined } from '@ant-design/icons';
import React from 'react';

import './CopyButton.scss';

export const CopyButton = () => {
  return <button className="copy-button">
    <CopyOutlined className="copy-button__icon" />
  </button>;
};

export const CopyButtonPure = React.memo(CopyButton);
