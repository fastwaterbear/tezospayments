import { Result } from 'antd';
import React from 'react';

interface ErrorProps {
  description?: string;
}

export const Error = (props: ErrorProps) => {
  return <Result status="error" title="Error" subTitle={props.description} />;
};

export const ErrorPure = React.memo(Error);
