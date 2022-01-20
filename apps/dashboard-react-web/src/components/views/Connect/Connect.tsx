import React from 'react';
import { Navigate } from 'react-router-dom';

import { config } from '../../../config';
import { selectCurrentAccount } from '../../../store/accounts/selectors';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { ConnectDropdownPure } from './ConnectDropdown';
import './Connect.scss';

export const Connect = () => {
  const langResources = useCurrentLanguageResources();
  const connectLangResources = langResources.views.connect.actions.connect;

  const currentAccount = useAppSelector(selectCurrentAccount);
  if (currentAccount) {
    return <Navigate to={config.routers.overview} />;
  }

  return <View title="Connect" className="connect">
    <div className="connect-info-container">
      <div className="connect-info-container__message">{connectLangResources.description}</div>
      <ConnectDropdownPure />
    </div>
  </View >;
};
export const ConnectPure = React.memo(Connect);
