import React, { useState } from "react";
import logo from "/logo.png";
import logo2 from "/logo2.png";
import useAuth from "@/hooks/auth/useAuth";
import UserOptions from "./UserOptions";

import {
  DesktopOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
const { Header, Content, Sider } = Layout;
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const userItems: MenuItem[] = [
  getItem(<Link to="/">Dashboard</Link>, "1", <DesktopOutlined />),
];

const adminItems: MenuItem[] = [
  getItem(<Link to="/">Dashboard</Link>, "1", <DesktopOutlined />),
  getItem("Admin", "sub1", <SettingOutlined />, [
    getItem(<Link to="/users">Users</Link>, "2", <UserOutlined />),
  ]),
];

type LayoutProps = {
  children: React.ReactNode;
};

const LayoutComponent = ({ children }: LayoutProps): JSX.Element => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen">
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          className={`${
            collapsed ? "h-16 p-2" : "h-20 p-4"
          } flex justify-center items-center`}
        >
          <img src={collapsed ? logo2 : logo} alt="Company Logo" />
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={isAdmin ? adminItems : userItems}
        />
      </Sider>
      <Layout>
        <Header
          className="p-0 flex justify-between items-center shadow-md"
          style={{
            background: colorBgContainer,
          }}
        >
          <div className="ml-4">People Tracking GPS</div>
          <UserOptions />
        </Header>
        <Content className="m-4">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
