import { DeleteOutlined } from '@ant-design/icons';
import { Button, List, Modal } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Service, ServiceSigningKey } from '@tezospayments/common';

import { getCurrentAccount } from '../../../../../store/accounts/selectors';
import { deleteApiKey } from '../../../../../store/services/slice';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

import './ApiKeyList.scss';

interface ApiKeyListProps {
  service: Service;
  readOnly: boolean;
}

export const ApiKeyList = (props: ApiKeyListProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;
  const currentAccount = useAppSelector(getCurrentAccount);
  const dispatch = useDispatch();
  const apiKeys = useMemo(
    () => {
      let keys = [...props.service.signingKeys.values()];

      if (currentAccount)
        keys = keys.filter(k => k.publicKey !== currentAccount.publicKey);

      return keys;
    },
    [currentAccount, props.service.signingKeys]
  );

  const confirm = useCallback((text: string, onOk: () => void) => {
    Modal.confirm({
      title: 'Confirm Operation',
      onOk,
      content: <p>{text}</p>,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      transitionName: '',
      maskTransitionName: ''
    });
  }, []);

  const handleRemoveItem = useCallback((item: ServiceSigningKey) => {
    const text = servicesLangResources.devZone.deleteKeyConfirmation + (item.name ? `: ${item.name}` : '');
    confirm(text, () => {
      dispatch(deleteApiKey({ service: props.service, publicKey: item.publicKey }));
    });
  }, [confirm, dispatch, props.service, servicesLangResources.devZone.deleteKeyConfirmation]);

  return <List size="small" bordered>
    {apiKeys.length
      ? apiKeys.map(apiKey => <List.Item key={apiKey.publicKey} className="api-keys__item">
        <span>{apiKey.name}</span>
        <div>
          <span className="api-keys__item-key">{apiKey.publicKey}</span>
          <Button disabled={props.readOnly} onClick={() => handleRemoveItem(apiKey)} icon={<DeleteOutlined />} danger type="link"></Button>
        </div>
      </List.Item>
      ) :
      <List.Item className="api-keys__item api-keys__item_empty">
        {servicesLangResources.devZone.noApiKeysAddedYet}
      </List.Item>}
  </List>;
};

export const ApiKeyListPure = React.memo(ApiKeyList);
