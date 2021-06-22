import { Button } from 'antd';
import React from 'react';

import './PayButton.scss';

interface PayButtonProps {
  text: string;
}

export const PayButton = (props: PayButtonProps) => {
  return <Button className="pay-button" type="primary" size="large">{props.text}</Button>;
};

export const PayButtonPure = React.memo(PayButton);
