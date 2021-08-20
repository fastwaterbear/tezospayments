import { DeleteOutlined } from '@ant-design/icons';
import { Button, List, Modal } from 'antd';
import React, { useCallback, useState } from 'react';

import { useCurrentLanguageResources } from '../../../../hooks';

import './ApiKeyList.scss';

export const ApiKeyList = () => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  const defaultData = [
    { name: 'Home PC', apiKey: 'SHA256:4T5E9yJjajhHazEUPHAYMa97bg7m6SxpInoxtX+XLPg' },
    { name: 'Work', apiKey: 'SHA256:Q0TPyOEbRpCZyoYRFyeGmzb4yg/ujidrRRoRnyJiuqo' },
  ];

  const [apiKeys, setApiKeys] = useState(defaultData);

  const confirm = useCallback((text: string, onOk: () => void) => {
    Modal.confirm({
      title: 'Confirm Operation',
      onOk,
      content: <p>{text}</p>,
      okText: 'Confirm',
      cancelText: 'Cancel',
      centered: true,
      transitionName: '',
      maskTransitionName: ''
    });
  }, []);

  const handleRemoveItem = useCallback((item: { name: string; apiKey: string; }) => {
    const text = `${servicesLangResources.devZone.deleteKeyConfirmation}: ${item.name}`;
    confirm(text, () => setApiKeys(apiKeys.filter(i => i.apiKey !== item.apiKey)));
  }, [apiKeys, confirm, servicesLangResources.devZone.deleteKeyConfirmation]);

  return <List size="small" bordered>
    {apiKeys.length
      ? apiKeys.map(i => <List.Item key={i.apiKey} className="api-keys__item">
        <span>{i.name}</span>
        <div>
          <span className="api-keys__item-key">{i.apiKey}</span>
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
