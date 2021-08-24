import { DeleteOutlined } from '@ant-design/icons';
import { Button, List, Modal } from 'antd';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Service } from '@tezospayments/common/src';

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

  const apiKeys = Object.entries(props.service.signingKeys).map(([_k, v]) => ({
    name: v.name,
    publicKey: v.publicKey
  }));

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

  const handleRemoveItem = useCallback((item: { name: string; publicKey: string; }) => {
    const text = `${servicesLangResources.devZone.deleteKeyConfirmation}: ${item.name}`;
    confirm(text, () => {
      dispatch(deleteApiKey({ service: props.service, publicKey: item.publicKey }));
    });
  }, [confirm, dispatch, props.service, servicesLangResources.devZone.deleteKeyConfirmation]);

  return <List size="small" bordered>
    {apiKeys.length
      ? apiKeys.map(i => <List.Item key={i.publicKey} className="api-keys__item">
        <span>{i.name}</span>
        <div>
          <span className="api-keys__item-key">{i.publicKey}</span>
          <Button onClick={() => handleRemoveItem(i)} icon={<DeleteOutlined />} danger type="link"></Button>
        </div>
      </List.Item>
      ) :
      <List.Item className="api-keys__item api-keys__item_empty">
        {servicesLangResources.devZone.noApiKeysAddedYet}
      </List.Item>}
  </List>;
};

export const ApiKeyListPure = React.memo(ApiKeyList);
