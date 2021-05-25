import React, { useCallback } from 'react';

import { connectAccount } from '../../../store/accounts/slice';
import { ButtonPure } from '../../common';
import { useAppDispatch } from '../../hooks';
import { View } from '../View';

export const Connect = () => {
    const dispatch = useAppDispatch();
    const handleConnectButtonClick = useCallback(() => {
        dispatch(connectAccount());
    }, [dispatch]);

    return <View title="Connect" className="connect">
        <ButtonPure onClick={handleConnectButtonClick}>Connect</ButtonPure>
    </View >;
};
export const ConnectPure = React.memo(Connect);
