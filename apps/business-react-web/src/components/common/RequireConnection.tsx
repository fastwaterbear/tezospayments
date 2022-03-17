import { useLocation, Navigate } from 'react-router-dom';

import { config } from '../../config';
import { useAppSelector } from '../hooks';

const defaultConnectPath = config.routers.connect;

interface RequireConnectionProps {
  children: JSX.Element;
  connectPath?: string;
  isConnected: boolean;
}

export const RequireConnection = ({ children, isConnected, connectPath = defaultConnectPath }: RequireConnectionProps) => {
  const location = useLocation();

  return isConnected
    ? children
    : <Navigate to={connectPath} state={{ from: location }} />;
};

type RequireConnectionContainerProps = Omit<RequireConnectionProps, 'isConnected'>;

export const RequireConnectionContainer = (props: RequireConnectionContainerProps) => {
  const currentAccount = useAppSelector(state => state.accountsState.currentAccount);

  return <RequireConnection {...props} isConnected={!!currentAccount} />;
};
