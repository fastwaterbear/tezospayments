import React, { useCallback } from 'react';
import { Redirect } from 'react-router-dom';

import { config } from '../../../config';
import { getCurrentAccount } from '../../../store/accounts/selectors';
import { connectAccount } from '../../../store/accounts/slice';
import { ButtonPure } from '../../common';
import { useAppDispatch, useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import './Connect.scss';

export const Connect = () => {
  const dispatch = useAppDispatch();
  const handleConnectButtonClick = useCallback(() => {
    dispatch(connectAccount());
  }, [dispatch]);

  const langResources = useCurrentLanguageResources();
  const accountLangResources = langResources.views.connect;

  const currentAccount = useAppSelector(getCurrentAccount);
  if (currentAccount) {
    return <Redirect push to={config.routers.overview} />;
  }

  return <View title="Connect" className="connect">
    <div className="connect-info-container">
      <div className="connect-info-container__message">{accountLangResources.connectIntroMessage}</div>
      <ButtonPure onClick={handleConnectButtonClick}>{accountLangResources.connectButtonTitle}</ButtonPure>
    </div>
  </View >;
};
export const ConnectPure = React.memo(Connect);
