import { DeleteOutlined } from '@ant-design/icons';
import { Button, List } from 'antd';
import React, { useCallback, useState } from 'react';

import './DevZone.scss';

export const DevZone = () => {
  const defaultData = [
    { name: 'Home PC', apiKey: 'SHA256:4T5E9yJjajhHazEUPHAYMa97bg7m6SxpInoxtX+XLPg' },
    { name: 'Work', apiKey: 'SHA256:Q0TPyOEbRpCZyoYRFyeGmzb4yg/ujidrRRoRnyJiuqo' },
  ];

  const [apiKeys, setApiKeys] = useState(defaultData);

  const handleRemoveItem = useCallback((key: string) => {
    setApiKeys(apiKeys.filter(i => i.apiKey !== key));
  }, [apiKeys]);

  return <>
    <div className="service-danger-zone__button-container">
      <span className="service-dev-zone__header">{'API Keys'}</span>
      <Button className="service-button" type="default" >
        {'Add Key'}
      </Button>
    </div>
    <List size="small" bordered>
      {apiKeys.length
        ? apiKeys.map(i => <List.Item key={i.apiKey} className="api-keys__item">
          <span>{i.name}</span>
          <div>
            <span className="api-keys__item-key">{i.apiKey}</span>
            <Button onClick={() => handleRemoveItem(i.apiKey)} icon={<DeleteOutlined />} danger type="link"></Button>
          </div>
        </List.Item>
        ) :
        <List.Item className="api-keys__item api-keys__item_empty">
          {'No API keys added yet'}
        </List.Item>}
    </List>
  </>;
};

export const DevZonePure = React.memo(DevZone);
