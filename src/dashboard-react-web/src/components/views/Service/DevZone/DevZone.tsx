import { DeleteOutlined } from '@ant-design/icons';
import { Button, List } from 'antd';
import React from 'react';

import './DevZone.scss';

export const DevZone = () => {
  const data = [
    { name: 'Home PC', apiKey: 'SHA256:4T5E9yJjajhHazEUPHAYMa97bg7m6SxpInoxtX+XLPg' },
    { name: 'Work', apiKey: 'SHA256:Q0TPyOEbRpCZyoYRFyeGmzb4yg/ujidrRRoRnyJiuqo' },
  ];
  return <>
    <div className="service-danger-zone__button-container">
      <span className="service-dev-zone__header">{'API Keys'}</span>
      <Button className="service-button" type="default" >
        {'Add Key'}
      </Button>
    </div>
    <List
      size="small"
      bordered
      dataSource={data}
      renderItem={item => (
        <List.Item className="api-keys__item">
          <span>{item.name}</span>
          <div>
            <span className="api-keys__item-key">{item.apiKey}</span>
            <Button icon={<DeleteOutlined />} danger type="link"></Button>
          </div>
        </List.Item>
      )}
    />
  </>;
};

export const DevZonePure = React.memo(DevZone);
