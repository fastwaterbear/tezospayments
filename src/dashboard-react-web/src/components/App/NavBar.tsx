import { UserOutlined, DashboardOutlined, UnorderedListOutlined, ProfileOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';

import { useCurrentLanguageResources } from '../hooks';
import './NavBar.scss';

const NavBar = () => {
  const langResources = useCurrentLanguageResources();
  const viewsLangResources = langResources.views;

  return <aside>
    <Menu className="navbar" mode="inline">
      <Menu.Item key="1" icon={<DashboardOutlined />}>{viewsLangResources.overview.title}</Menu.Item>
      <Menu.Item key="2" icon={<UnorderedListOutlined />}>{viewsLangResources.operations.title}</Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>{viewsLangResources.services.title}</Menu.Item>
      <Menu.Item key="4" icon={<ProfileOutlined />}>{viewsLangResources.settings.title}</Menu.Item>
      <Menu.Item key="5" icon={<InfoCircleOutlined />}>{viewsLangResources.about.title}</Menu.Item>
    </Menu>
  </aside>;
};

export const NavBarPure = React.memo(NavBar);
