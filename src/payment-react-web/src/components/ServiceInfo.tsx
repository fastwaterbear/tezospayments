import { CopyOutlined } from '@ant-design/icons';
import React from 'react';
import './ServiceInfo.scss';

export const ServiceInfo = () => {
  return <div className="service-info">
    <img className="service-icon" src="https://avatars.githubusercontent.com/u/82229602" alt="Service" draggable="false" />
    <h2 className="service-name">Test Service of Fast Water Bear</h2>
    <div className="service-contract">
      <span className="service-contract__label">Contract Address</span>
      <div className="service-contract__value-container">
        <a className="service-contract__value"
          target="_blank"
          rel="noopener noreferrer"
          href="https://better-call.dev/edo2net/KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x"
        >
          KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x
        </a>
        <button className="service-contract__copy-button">
          <CopyOutlined className="service-contract__copy-icon" />
        </button>
      </div>
    </div>
    <div className="service-links">
      <a className="service-link" href="https://github.com/fastwaterbear" target="_blank" rel="noopener noreferrer">
        https://github.com/fastwaterbear
      </a>
      <a className="service-link" href="https://t.me/fastwaterbear" target="_blank" rel="noopener noreferrer">
        https://t.me/fastwaterbear
      </a>
    </div>
  </div>;
};

export const ServiceInfoPure = React.memo(ServiceInfo);
