import { SettingOutlined, DashboardOutlined, UnorderedListOutlined, ProfileOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Menu, Button } from 'antd';
import React, { useCallback } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { config } from '../../../config';
import { useCurrentLanguageResources } from '../../hooks';
import './NavBar.scss';

export const NavBar = () => {
  const location = useLocation();
  const langResources = useCurrentLanguageResources();
  const viewsLangResources = langResources.views;
  const history = useHistory();

  const handleCreateServiceClick = useCallback(() => {
    history.push(config.routers.createService);
  }, [history]);

  const handleAcceptPaymentsClick = useCallback(() => {
    history.push(config.routers.acceptPayments);
  }, [history]);

  return <nav className="navbar">
    <Menu className="navbar__menu" mode="inline" selectedKeys={[location.pathname]}>
      <Menu.Item key={config.routers.overview} icon={<DashboardOutlined />}>
        <Link to={config.routers.overview}>{viewsLangResources.overview.title}</Link>
      </Menu.Item>
      <Menu.Item key={config.routers.operations} icon={<UnorderedListOutlined />}>
        <Link to={config.routers.operations}>{viewsLangResources.operations.title}</Link>
      </Menu.Item>
      <Menu.Item key={config.routers.services} icon={<ProfileOutlined />}>
        <Link to={config.routers.services}>{viewsLangResources.services.title}</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} disabled>{viewsLangResources.settings.title}</Menu.Item >
      <Menu.Item key={config.routers.about} icon={<InfoCircleOutlined />}>
        <Link to={config.routers.about}>{viewsLangResources.about.title}</Link>
      </Menu.Item>
    </Menu>

    <div className="navbar__bottom-buttons">
      <Button onClick={handleCreateServiceClick}>{viewsLangResources.createService.title}</Button>
      <Button onClick={handleAcceptPaymentsClick} type="primary">{viewsLangResources.acceptPayments.title}</Button>
    </div>
  </nav>;
};

export const NavBarPure = React.memo(NavBar);
