import React from 'react';
import { Redirect } from 'react-router-dom';

import { config } from '../../../config';
import { selectCurrentAccount } from '../../../store/accounts/selectors';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import './Connect.scss';
import { ConnectDropdownPure } from './ConnectDropdown';

export const Connect = () => {
  const langResources = useCurrentLanguageResources();
  const connectLangResources = langResources.views.connect.actions.connect;

  const currentAccount = useAppSelector(selectCurrentAccount);
  if (currentAccount) {
    return <Redirect push to={config.routers.overview} />;
  }

  return <View title="Connect" className="connect">
    <div className="connect-info-container">
      <div className="connect-info-container__message">{connectLangResources.description}</div>
      <ConnectDropdownPure />
    </div>
  </View >;
};
export const ConnectPure = React.memo(Connect);
