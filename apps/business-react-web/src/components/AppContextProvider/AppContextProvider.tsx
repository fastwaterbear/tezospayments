import { useState, useEffect, useCallback } from 'react';

import type { Network, PublicEventEmitter } from '@tezospayments/common';

import { ReactAppContext } from '../../app';

interface AppContextProviderProps {
  getReactAppContext: () => ReactAppContext;
  networkChangedEvent: PublicEventEmitter<readonly [newNetwork: Network, previousNetwork: Network]>;
  children: React.ReactNode;
}

export const AppContextProvider = ({ getReactAppContext, networkChangedEvent, children }: AppContextProviderProps) => {
  const [currentValue, setCurrentValue] = useState<ReactAppContext>(getReactAppContext());

  const handleNetworkChanged = useCallback(
    () => setCurrentValue(getReactAppContext()),
    [getReactAppContext]
  );

  useEffect(
    () => {
      networkChangedEvent.addListener(handleNetworkChanged);

      return () => {
        networkChangedEvent.removeListener(handleNetworkChanged);
      };
    },
    [networkChangedEvent, handleNetworkChanged]
  );

  return <ReactAppContext.Provider value={currentValue}>
    {children}
  </ReactAppContext.Provider>;
};

