import { UserOutlined, DashboardOutlined, UnorderedListOutlined, ProfileOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';
import './NavBar.scss';

const NavBar = () => {
  return <aside>
    <Menu className="navbar" mode="inline">
      <Menu.Item key="1" icon={<DashboardOutlined />}>Overview</Menu.Item>
      <Menu.Item key="2" icon={<UnorderedListOutlined />}>Operations</Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>Services</Menu.Item>
      <Menu.Item key="4" icon={<ProfileOutlined />}>Settings</Menu.Item>
      <Menu.Item key="5" icon={<InfoCircleOutlined />}>About</Menu.Item>
    </Menu>
  </aside>;
};

export const NavBarPure = React.memo(NavBar);
