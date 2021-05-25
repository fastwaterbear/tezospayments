import { Route, RouteProps, Redirect } from 'react-router';

import { config } from '../../config';
import { useAppSelector } from '../hooks';

const defaultConnectPath = config.routers.connect;
interface PrivateRouteProps extends RouteProps {
    children: NonNullable<RouteProps['children']>;
    connectPath?: string;
    isConnected: boolean;
}

export const PrivateRoute = ({ children, isConnected, connectPath = defaultConnectPath, ...routeProps }: PrivateRouteProps) => (
    <Route {...routeProps} children={props => isConnected
        ? children
        : <Redirect to={{
            pathname: connectPath,
            state: { from: props.location }
        }} />
    } />
);

type PrivateRouteContainerProps = Omit<PrivateRouteProps, 'isConnected'>;

export const PrivateRouteContainer = (props: PrivateRouteContainerProps) => {
    const currentAccountAddress = useAppSelector(state => state.accountsState.currentAccountAddress);

    return <PrivateRoute {...props} isConnected={!!currentAccountAddress} />;
};
