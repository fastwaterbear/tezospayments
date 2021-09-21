import { DeleteOutlined } from '@ant-design/icons';
import { Button, List, Modal } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Service, ServiceSigningKey } from '@tezospayments/common';

import { deleteApiKey } from '../../../../../store/services/slice';
import { useCurrentLanguageResources } from '../../../../hooks';

import './ApiKeyList.scss';

interface ApiKeyListProps {
  service: Service;
}

export const ApiKeyList = (props: ApiKeyListProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;
  const dispatch = useDispatch();
  const apiKeys = useMemo(() => [...props.service.signingKeys.values()], [props.service.signingKeys]);

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
          <Button onClick={() => handleRemoveItem(apiKey)} icon={<DeleteOutlined />} danger type="link"></Button>
        </div>
      </List.Item>
      ) :
      <List.Item className="api-keys__item api-keys__item_empty">
        {servicesLangResources.devZone.noApiKeysAddedYet}
      </List.Item>}
  </List>;
};

export const ApiKeyListPure = React.memo(ApiKeyList);
