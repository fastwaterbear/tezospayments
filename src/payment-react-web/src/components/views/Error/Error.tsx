import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Result } from 'antd';
import React, { useCallback } from 'react';

import { ApplicationError, isRegisteredApplicationError } from '../../../models/system';
import { clearError } from '../../../store/applicationError';
import { loadCurrentPayment } from '../../../store/currentPayment';
import { useAppDispatch } from '../../hooks';

interface ErrorProps {
  error: ApplicationError;
}

export const Error = (props: ErrorProps) => {
  const description = isRegisteredApplicationError(props.error)
    ? `Error: [${props.error.id}]`
    : props.error.message;

  const dispatch = useAppDispatch();
  const handleButtonClick = useCallback(() => {
    dispatch(loadCurrentPayment())
      .then(unwrapResult)
      .then(() => dispatch(clearError()));
  }, [dispatch]);

  return <Result status="error" title="Error" subTitle={description} extra={
    <Button onClick={handleButtonClick}>Try Again</Button>
  } />;
};

export const ErrorPure = React.memo(Error);
