import { UserOutlined, DashboardOutlined, UnorderedListOutlined, ProfileOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { config } from '../../config';
import { useCurrentLanguageResources } from '../hooks';
import './NavBar.scss';

const NavBar = () => {
  const location = useLocation();
  const langResources = useCurrentLanguageResources();
  const viewsLangResources = langResources.views;

  return <nav>
    <Menu className="navbar" mode="inline" selectedKeys={[location.pathname]}>
      <Menu.Item key={config.routers.overview} icon={<DashboardOutlined />}>
        <Link to={config.routers.overview}>{viewsLangResources.overview.title}</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<UnorderedListOutlined />}>{viewsLangResources.operations.title}</Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>{viewsLangResources.services.title}</Menu.Item>
      <Menu.Item key="4" icon={<ProfileOutlined />}>{viewsLangResources.settings.title}</Menu.Item>
      <Menu.Item key="5" icon={<InfoCircleOutlined />}>{viewsLangResources.about.title}</Menu.Item>
    </Menu>
  </nav>;
};

export const NavBarPure = React.memo(NavBar);
