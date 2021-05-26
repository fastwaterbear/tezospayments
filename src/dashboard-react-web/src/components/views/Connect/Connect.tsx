import React, { useCallback } from 'react';

import { connectAccount } from '../../../store/accounts/slice';
import { ButtonPure } from '../../common';
import { useAppDispatch, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import './Connect.scss';

export const Connect = () => {
  const dispatch = useAppDispatch();
  const handleConnectButtonClick = useCallback(() => {
    dispatch(connectAccount());
  }, [dispatch]);

  const langResources = useCurrentLanguageResources();
  const accountLangResources = langResources.views.connect;

  return <View title="Connect" className="connect">
    <div className="connect-info-container">
      <div className="connect-info-container__message">{accountLangResources.connectIntroMessage}</div>
      <ButtonPure onClick={handleConnectButtonClick}>{accountLangResources.connectButtonTitle}</ButtonPure>
    </div>
  </View >;
};
export const ConnectPure = React.memo(Connect);
