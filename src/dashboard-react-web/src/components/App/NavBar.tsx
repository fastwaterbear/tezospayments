import { SettingOutlined, DashboardOutlined, UnorderedListOutlined, ProfileOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Menu, Button } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { config } from '../../config';
import { useCurrentLanguageResources } from '../hooks';
import './NavBar.scss';

const NavBar = () => {
  const location = useLocation();
  const langResources = useCurrentLanguageResources();
  const viewsLangResources = langResources.views;

  return <nav className="navbar">
    <Menu className="navbar__menu" mode="inline" selectedKeys={[location.pathname]}>
      <Menu.Item key={config.routers.overview} icon={<DashboardOutlined />}>
        <Link to={config.routers.overview}>{viewsLangResources.overview.title}</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<UnorderedListOutlined />}>{viewsLangResources.operations.title}</Menu.Item>
      <Menu.Item key="3" icon={<ProfileOutlined />}>{viewsLangResources.services.title}</Menu.Item>
      <Menu.Item key="4" icon={<SettingOutlined />}>{viewsLangResources.settings.title}</Menu.Item >
      <Menu.Item key="5" icon={<InfoCircleOutlined />}>{viewsLangResources.about.title}</Menu.Item>
    </Menu>

    <div className="navbar__bottom-buttons">
      <Button>{viewsLangResources.createService.title}</Button>
      <Button type="primary">{viewsLangResources.acceptPayments.title}</Button>
    </div>
  </nav>;
};

export const NavBarPure = React.memo(NavBar);
